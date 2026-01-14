import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Participant } from './entities/participant.entity';
import { ParticipantsController } from './paricipants.controller';
import { ParticipantsRepository } from './participants.repository';
import { ParticipantsService } from './participants.service';

import { TestsModule } from '#domain/tests/tests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), TestsModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, ParticipantsRepository],
})
export class ParticipantsModule {}
