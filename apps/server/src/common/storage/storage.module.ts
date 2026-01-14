import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { S3_CLIENT } from './const';
import { S3StorageService } from './s3-storage.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

import { ENV_KEYS } from '#common/config/env.constants';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [
    {
      provide: S3_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new S3Client({
          region: config.get<string>(ENV_KEYS.S3_REGION)!,
          endpoint: config.get<string>(ENV_KEYS.S3_ENDPOINT)!,
          credentials: {
            accessKeyId: config.get<string>(ENV_KEYS.S3_ACCESS_KEY_ID)!,
            secretAccessKey: config.get<string>(ENV_KEYS.S3_SECRET_ACCESS_KEY)!,
          },
        });
      },
    },
    StorageService,
    S3StorageService,
  ],
  exports: [StorageService, S3StorageService, S3_CLIENT],
})
export class StorageModule {}
