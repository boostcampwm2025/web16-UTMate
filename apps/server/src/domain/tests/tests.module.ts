import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Test } from './entities/test.entity';
import { TestsController } from './tests.controller';
import { TestsRepository } from './tests.repository';
import { TestsService } from './tests.service';

import { MissionResultModule } from '#domain/mission-result/mission-results.module';
import { MissionModule } from '#domain/missions/missions.module';
import { ParticipantsModule } from '#domain/participants/participants.module';
import { UsersModule } from '#domain/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test]),
    MissionModule,
    MissionResultModule,
    ParticipantsModule,
    UsersModule,
  ],
  controllers: [TestsController],
  providers: [TestsService, TestsRepository],
  exports: [TestsService],
})
export class TestsModule {}
