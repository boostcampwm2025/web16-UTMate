import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Test } from './entities/test.entity';
import { TestsService } from './services/tests.service';
import { TestsCommandService } from './services/tests-command.service';
import { TestsMemberService } from './services/tests-member.service';
import { TestsParticipantService } from './services/tests-participant.service';
import { TestsQueryService } from './services/tests-query.service';
import { TestsResultService } from './services/tests-result.service';
import { TestsController } from './tests.controller';
import { TestsRepository } from './tests.repository';

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
  providers: [
    TestsService,
    TestsQueryService,
    TestsCommandService,
    TestsResultService,
    TestsParticipantService,
    TestsMemberService,
    TestsRepository,
  ],
  exports: [TestsService],
})
export class TestsModule {}
