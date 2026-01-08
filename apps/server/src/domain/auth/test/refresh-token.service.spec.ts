import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';

import { TokenDto } from '../dto/token.dto';
import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

import { RT_REDIS } from '#common/redis/redis.module';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let redisClient: Redis;
  let tokenService: TokenService;

  const mockRedisClient = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockTokenService = {
    generateTokenPair: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: RT_REDIS,
          useValue: mockRedisClient,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    redisClient = module.get<Redis>(RT_REDIS);
    tokenService = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveRefreshToken', () => {
    it('Redis에 리프레시 토큰을 저장해야 한다', async () => {
      const userId = 'user-123';
      const familyId = 'family-456';
      const refreshToken = 'refresh-token-xyz';
      const ttl = 604800;

      mockConfigService.get.mockReturnValue(ttl);

      await service.saveRefreshToken(userId, familyId, refreshToken);

      expect(redisClient.set).toHaveBeenCalledWith(
        `rt:${userId}:${familyId}`,
        refreshToken,
        'EX',
        ttl,
      );
    });

    it('올바른 키 형식으로 저장해야 한다', async () => {
      const userId = 'test-user';
      const familyId = 'test-family';
      const refreshToken = 'test-token';

      mockConfigService.get.mockReturnValue(604800);

      await service.saveRefreshToken(userId, familyId, refreshToken);

      expect(redisClient.set).toHaveBeenCalledWith(
        'rt:test-user:test-family',
        expect.any(String),
        'EX',
        expect.any(Number),
      );
    });
  });

  describe('rotateRefreshToken', () => {
    it('토큰이 일치하면 새로운 토큰을 생성해야 한다', async () => {
      const userId = 'user-123';
      const familyId = 'family-456';
      const oldRefreshToken = 'old-refresh-token';
      const newTokenDto: TokenDto = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockRedisClient.get.mockResolvedValue(oldRefreshToken);
      mockTokenService.generateTokenPair.mockResolvedValue(newTokenDto);
      mockConfigService.get.mockReturnValue(604800);

      const result = await service.rotateRefreshToken(userId, familyId, oldRefreshToken);

      expect(redisClient.get).toHaveBeenCalledWith(`rt:${userId}:${familyId}`);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(userId, familyId);
      expect(redisClient.set).toHaveBeenCalledWith(
        `rt:${userId}:${familyId}`,
        'new-refresh-token',
        'EX',
        604800,
      );
      expect(result).toEqual(newTokenDto);
    });

    it('토큰이 일치하지 않으면 UnauthorizedException을 던지고 토큰을 삭제해야 한다', async () => {
      const userId = 'user-123';
      const familyId = 'family-456';
      const invalidRefreshToken = 'invalid-token';

      mockRedisClient.get.mockResolvedValue('stored-token');

      await expect(
        service.rotateRefreshToken(userId, familyId, invalidRefreshToken),
      ).rejects.toThrow(UnauthorizedException);

      expect(redisClient.del).toHaveBeenCalledWith(`rt:${userId}:${familyId}`);
      expect(tokenService.generateTokenPair).not.toHaveBeenCalled();
    });

    it('Redis에 토큰이 없으면 UnauthorizedException을 던져야 한다', async () => {
      const userId = 'user-123';
      const familyId = 'family-456';
      const refreshToken = 'some-token';

      mockRedisClient.get.mockResolvedValue(null);

      await expect(service.rotateRefreshToken(userId, familyId, refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(redisClient.del).toHaveBeenCalledWith(`rt:${userId}:${familyId}`);
    });
  });
});
