import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Participant } from './entities/participant.entity';
import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  constructor(@Inject() private readonly participantsRepository: ParticipantsRepository) {}

  async createParticipant(userId: number | undefined, testId: number) {
    const participant = Participant.create(userId, testId);
    const savedParticipant = await this.participantsRepository.save(participant);
    return { participantId: savedParticipant.publicId };
  }

  async findIdByPublicId(ParticipantId: string) {
    const participant = await this.participantsRepository.findByPublicId(ParticipantId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    return participant.id;
  }
}
