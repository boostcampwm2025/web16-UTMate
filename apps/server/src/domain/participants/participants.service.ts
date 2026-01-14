import { Inject, Injectable } from '@nestjs/common';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './entities/participant.entity';
import { ParticipantsRepository } from './participants.repository';

import { TestsService } from '#domain/tests/tests.service';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject() private readonly participantsRepository: ParticipantsRepository,
    @Inject() private readonly testsService: TestsService,
  ) {}

  async createParticipant(userId: number | undefined, createParticipantDto: CreateParticipantDto) {
    const testId = await this.testsService.findIdByPublicId(createParticipantDto.testId);
    const participant = Participant.create(userId, testId);
    return this.participantsRepository.save(participant);
  }
}
