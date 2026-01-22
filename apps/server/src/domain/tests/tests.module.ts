import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Mission } from './entities/mission.entity';
import { Test } from './entities/test.entity';
import { MissionsController } from './missions.controller';
import { MissionRepository } from './missions.repository';
import { MissionsService } from './missions.service';
import { TestsController } from './tests.controller';
import { TestsRepository } from './tests.repository';
import { TestsService } from './tests.service';

import { MissionResultModule } from '#domain/mission-result/mission-results.module';
import { ParticipantsModule } from '#domain/participants/participants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Test, Mission]), ParticipantsModule, MissionResultModule],
  controllers: [TestsController, MissionsController],
  providers: [TestsService, TestsRepository, MissionsService, MissionRepository],
  exports: [TestsService],
})
export class TestsModule {}
