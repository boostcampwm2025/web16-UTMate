import { Module } from '@nestjs/common';

import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';

import { StorageModule } from '#common/storage/storage.module';
import { TestsModule } from '#domain/tests/tests.module';

@Module({
  imports: [StorageModule, TestsModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
