import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

import { RT_REDIS } from '#common/redis/redis.module';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let redisClient: { set: jest.Mock; get: jest.Mock; del: jest.Mock };
  let configService: { get: jest.Mock };
  let tokenService: { generateTokenPair: jest.Mock };

  beforeEach(async () => {
    redisClient = { set: jest.fn(), get: jest.fn(), del: jest.fn() };
    configService = { get: jest.fn() };
    tokenService = { generateTokenPair: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: RT_REDIS, useValue: redisClient },
        { provide: ConfigService, useValue: configService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();
    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveRefreshToken', () => {
    it('Refresh Token을 Redis에 저장한다', async () => {
      configService.get.mockReturnValue(3600);
      await service.saveRefreshToken('user1', 'family1', 'refresh-token');
      expect(redisClient.set).toHaveBeenCalledWith('rt:user1:family1', 'refresh-token', 'EX', 3600);
    });
  });

  describe('rotateRefreshToken', () => {
    it('기존 토큰과 일치하면 새 토큰을 발급하고 저장한다', async () => {
      redisClient.get.mockResolvedValue('old-refresh');
      tokenService.generateTokenPair.mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
      configService.get.mockReturnValue(3600);
      jest.spyOn(service, 'saveRefreshToken').mockResolvedValue();
      const result = await service.rotateRefreshToken('user1', 'family1', 'old-refresh');
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith('user1', 'family1');
      expect(service.saveRefreshToken).toHaveBeenCalledWith('user1', 'family1', 'b');
      expect(result).toEqual({ accessToken: 'a', refreshToken: 'b' });
    });

    it('기존 토큰과 다르면 Redis에서 해당 토큰을 삭제하고 예외를 던진다', async () => {
      redisClient.get.mockResolvedValue('not-matching');
      const delSpy = jest.spyOn(redisClient, 'del');
      await expect(service.rotateRefreshToken('user1', 'family1', 'old-refresh')).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(delSpy).toHaveBeenCalledWith('rt:user1:family1');
    });
  });

  describe('deleteRefreshToken', () => {
    it('Redis에서 Refresh Token을 삭제한다', async () => {
      await service.deleteRefreshToken('user1', 'family1');
      expect(redisClient.del).toHaveBeenCalledWith('rt:user1:family1');
    });
  });
});
