import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Participant } from './entities/participant.entity';
import { ParticipantsController } from './paricipants.controller';
import { ParticipantsRepository } from './participants.repository';
import { ParticipantsService } from './participants.service';

import { MissionResultModule } from '#domain/mission-result/mission-results.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), MissionResultModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, ParticipantsRepository],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
