import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { TokenDto } from './dto/token.dto';
import { TokenService } from './token.service';

import { RT_REDIS } from '#common/redis/redis.module';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(RT_REDIS) private readonly redisClient: Redis,
    @Inject() private readonly config: ConfigService,
    @Inject() private readonly tokenService: TokenService,
  ) {}

  /**
   * Refresh Token을 Redis에 저장합니다.
   * @param userId redis key의 일부로 사용됩니다.
   * @param familyId redis key의 일부로 사용됩니다.
   * @param refreshToken redis value로 사용됩니다.
   */
  async saveRefreshToken(userId: string, familyId: string, refreshToken: string): Promise<void> {
    const key = `rt:${userId}:${familyId}`;

    const ttl = this.config.get<number>('JWT_REFRESH_EXPIRES_IN')!;

    await this.redisClient.set(key, refreshToken, 'EX', ttl);
  }

  /**
   * Refresh Token을 재발급 합니다.
   * 기존의 refresh token과 일치하는지 검증 후 실패 시 탈취로 판단, 동일 familyId의 토큰을 모두 무효화합니다.
   * @param userId redis key의 일부로 사용됩니다.
   * @param familyId redis key의 일부로 사용됩니다.
   * @param refreshToken 기존의 refresh token입니다.
   * @throws UnauthorizedException 토큰이 일치하지 않을 경우 발생합니다.
   */
  async rotateRefreshToken(
    userId: string,
    familyId: string,
    refreshToken: string,
  ): Promise<TokenDto> {
    const key = `rt:${userId}:${familyId}`;
    const existingToken = await this.redisClient.get(key);

    if (existingToken !== refreshToken) {
      Logger.warn(
        `Refresh token mismatch for user ${userId} and familyId ${familyId}. Possible token theft.`,
      );
      await this.redisClient.del(key);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newTokenDto = await this.tokenService.generateTokenPair(userId, familyId);
    await this.saveRefreshToken(userId, familyId, newTokenDto.refreshToken);

    return newTokenDto;
  }

  /**
   * Refresh Token을 삭제합니다.
   * @param userId Redis key의 일부로 사용됩니다.
   * @param familyId Redis key의 일부로 사용됩니다.
   */
  async deleteRefreshToken(userId: string, familyId: string) {
    const key = `rt:${userId}:${familyId}`;
    await this.redisClient.del(key);
  }
}
