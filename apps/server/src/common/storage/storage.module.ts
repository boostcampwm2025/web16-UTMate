import { Module } from '@nestjs/common';

import { S3StorageService } from './s3-storage.service';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService, S3StorageService],
  exports: [StorageService, S3StorageService],
})
export class StorageModule {}
