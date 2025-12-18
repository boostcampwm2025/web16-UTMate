import { Module } from '@nestjs/common';

import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';

import { StorageModule } from '#common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
