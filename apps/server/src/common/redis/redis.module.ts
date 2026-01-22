import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { ENV_KEYS } from '#common/config/env.constants';

export const RT_REDIS = Symbol('RT_REDIS');
export const USER_REDIS = Symbol('USER_REDIS');
export const SDK_AUTH_REDIS = Symbol('SDK_AUTH_REDIS');

@Global()
@Module({
  providers: [
    {
      provide: RT_REDIS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.get<string>(ENV_KEYS.REDIS_HOST)!,
          port: configService.get<number>(ENV_KEYS.REDIS_PORT)!,
        }),
    },
    {
      provide: USER_REDIS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.get<string>(ENV_KEYS.REDIS_HOST)!,
          port: configService.get<number>(ENV_KEYS.REDIS_PORT)!,
          keyPrefix: 'user:',
        }),
    },
    {
      provide: SDK_AUTH_REDIS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new Redis({
          host: configService.get<string>(ENV_KEYS.REDIS_HOST)!,
          port: configService.get<number>(ENV_KEYS.REDIS_PORT)!,
          keyPrefix: 'sdk_auth:',
        }),
    },
  ],
  exports: [RT_REDIS, USER_REDIS, SDK_AUTH_REDIS],
})
export class RedisModule {}
