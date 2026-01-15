import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { ENV_KEYS } from '#common/config/env.constants';

export const RT_REDIS = Symbol('RT_REDIS');

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
  ],
  exports: [RT_REDIS],
})
export class RedisModule {}
