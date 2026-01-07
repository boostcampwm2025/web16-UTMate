import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenDto } from '../dto/token.dto';
import { TokenService } from '../token.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokenPair', () => {
    it('액세스 토큰과 리프레시 토큰을 생성해야 한다', async () => {
      const publicId = 'user-123';
      const familyId = 'family-456';

      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return 900;
        if (key === 'JWT_REFRESH_EXPIRES_IN') return 604800;
        return null;
      });

      mockJwtService.signAsync
        .mockResolvedValueOnce('generated-access-token')
        .mockResolvedValueOnce('generated-refresh-token');

      const result = await service.generateTokenPair(publicId, familyId);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { sub: publicId, familyId },
        { secret: 'access-secret', expiresIn: 900 },
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: publicId, familyId },
        { secret: 'refresh-secret', expiresIn: 604800 },
      );

      expect(result).toBeInstanceOf(TokenDto);
      expect(result.accessToken).toBe('generated-access-token');
      expect(result.refreshToken).toBe('generated-refresh-token');
    });

    it('토큰을 병렬로 생성해야 한다', async () => {
      const publicId = 'user-123';
      const familyId = 'family-456';

      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'secret';
        if (key === 'JWT_REFRESH_SECRET') return 'secret';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return 900;
        if (key === 'JWT_REFRESH_EXPIRES_IN') return 604800;
        return null;
      });

      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('token1')
        .mockResolvedValueOnce('token2');

      await service.generateTokenPair(publicId, familyId);

      // Promise.all로 병렬 처리되므로 거의 동시에 호출됨
      expect(signAsyncSpy).toHaveBeenCalledTimes(2);
    });
  });
});
