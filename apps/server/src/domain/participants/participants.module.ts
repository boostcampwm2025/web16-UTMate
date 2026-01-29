import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Participant } from './entities/participant.entity';
import { PARTICIPANT_QUEUE } from './const';
import { ParticipantsController } from './paricipants.controller';
import { ParticipantsProcessor } from './participants.processor';
import { ParticipantsRepository } from './participants.repository';
import { ParticipantsService } from './participants.service';

import { MissionResultModule } from '#domain/mission-result/mission-results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant]),
    BullModule.registerQueue({ name: PARTICIPANT_QUEUE }),
    MissionResultModule,
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, ParticipantsRepository, ParticipantsProcessor],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
