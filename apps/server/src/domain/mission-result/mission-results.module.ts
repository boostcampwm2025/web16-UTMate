import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MissionResult } from './entities/mission-result.entity';
import { MissionResultsController } from './mission-results.controller';
import { MissionResultsRepository } from './mission-results.repository';
import { MissionResultsService } from './misson-results.service';

import { StorageModule } from '#common/storage/storage.module';
import { AnalyzerModule } from '#domain/analyzer/analyzer.module';

@Module({
  imports: [TypeOrmModule.forFeature([MissionResult]), StorageModule, AnalyzerModule],
  controllers: [MissionResultsController],
  providers: [MissionResultsService, MissionResultsRepository],
  exports: [MissionResultsService],
})
export class MissionResultModule {}
