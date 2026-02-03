import { Test, TestingModule } from '@nestjs/testing';

import { OAuthUserDto } from '../../users/dto/oauth-user.dto';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { TokenDto } from '../dto/token.dto';
import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

import { OAuthProvider } from '#domain/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let refreshTokenService: { saveRefreshToken: jest.Mock };
  let usersService: { registerOrUpdateUser: jest.Mock };
  let tokenService: { generateTokenPair: jest.Mock };

  beforeEach(async () => {
    refreshTokenService = { saveRefreshToken: jest.fn() };
    usersService = { registerOrUpdateUser: jest.fn() };
    tokenService = { generateTokenPair: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: RefreshTokenService, useValue: refreshTokenService },
        { provide: UsersService, useValue: usersService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('유저 로그인 시 UserService에 유저 처리를 위임한 후 반환 받은 publicId로 토큰을 생성하고 저장한다', async () => {
      const oAuthUserDto: OAuthUserDto = {
        id: 'user1',
        email: 'test@test.com',
        provider: OAuthProvider.github,
      } as unknown as OAuthUserDto;
      const publicId = 'public-id';
      const familyId = 'mock-uuid-for-family-id';
      const tokenDto: TokenDto = { accessToken: 'access', refreshToken: 'refresh' };

      usersService.registerOrUpdateUser.mockResolvedValue(publicId);
      jest.spyOn(global.crypto, 'randomUUID').mockReturnValue(familyId);
      tokenService.generateTokenPair.mockResolvedValue(tokenDto);
      refreshTokenService.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(oAuthUserDto);

      expect(usersService.registerOrUpdateUser).toHaveBeenCalledWith(oAuthUserDto);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(publicId, familyId);
      expect(refreshTokenService.saveRefreshToken).toHaveBeenCalledWith(
        publicId,
        familyId,
        tokenDto.refreshToken,
      );
      expect(result).toEqual(tokenDto);
    });
  });
});
