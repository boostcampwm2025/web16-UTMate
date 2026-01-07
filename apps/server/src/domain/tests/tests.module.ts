import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Mission } from './entities/mission.entity';
import { Test } from './entities/test.entity';
import { MissionRepository } from './missions.repository';
import { MissionsService } from './missions.service';
import { TestsController } from './tests.controller';
import { TestsRepository } from './tests.repository';
import { TestsService } from './tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Test, Mission])],
  controllers: [TestsController],
  providers: [TestsService, TestsRepository, MissionsService, MissionRepository],
})
export class TestsModule {}
