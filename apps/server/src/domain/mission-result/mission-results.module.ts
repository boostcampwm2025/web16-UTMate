import { Module } from '@nestjs/common';

import { MissionResultsController } from './mission-results.controller';
import { MissionResultsRepository } from './mission-results.repository';
import { MissionResultsService } from './misson-results.service';

import { StorageModule } from '#common/storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [MissionResultsController],
  providers: [MissionResultsService, MissionResultsRepository],
})
export class MissionResultModule {}
