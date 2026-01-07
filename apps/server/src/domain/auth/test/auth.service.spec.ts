import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { TokenDto } from '../dto/token.dto';
import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';
import { OAuthProvider } from '#domain/users/entities/user.entity';
import { UsersService } from '#domain/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;
  let refreshTokenService: RefreshTokenService;

  const mockUsersService = {
    registerOrUpdateUser: jest.fn(),
  };

  const mockTokenService = {
    generateTokenPair: jest.fn(),
  };

  const mockRefreshTokenService = {
    saveRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('사용자를 등록하고 토큰을 반환해야 한다', async () => {
      const oauthUserDto = {
        provider: OAuthProvider.github,
        providerId: 'github-123',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://avatar.url',
      } as OAuthUserDto;

      const publicId = 'user-public-id';
      const tokenDto: TokenDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockUsersService.registerOrUpdateUser.mockResolvedValue(publicId);
      mockTokenService.generateTokenPair.mockResolvedValue(tokenDto);
      mockRefreshTokenService.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(oauthUserDto);

      expect(usersService.registerOrUpdateUser).toHaveBeenCalledWith(oauthUserDto);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(
        publicId,
        expect.any(String), // familyId (UUID)
      );
      expect(refreshTokenService.saveRefreshToken).toHaveBeenCalledWith(
        publicId,
        expect.any(String), // familyId
        'refresh-token',
      );
      expect(result).toEqual(tokenDto);
    });

    it('로그인마다 다른 familyId를 생성해야 한다', async () => {
      const oauthUserDto = {
        provider: OAuthProvider.github,
        providerId: 'github-123',
        username: 'testuser',
        email: 'test@example.com',
        avatarUrl: 'https://avatar.url',
      } as OAuthUserDto;

      mockUsersService.registerOrUpdateUser.mockResolvedValue('user-id');
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'token1',
        refreshToken: 'token2',
      });

      await service.login(oauthUserDto);
      const firstFamilyId = mockTokenService.generateTokenPair.mock.calls[0][1];

      await service.login(oauthUserDto);
      const secondFamilyId = mockTokenService.generateTokenPair.mock.calls[1][1];

      expect(firstFamilyId).not.toBe(secondFamilyId);
      expect(firstFamilyId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(secondFamilyId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });
});
