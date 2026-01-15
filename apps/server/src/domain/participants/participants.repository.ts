import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsRepository {
  constructor(
    @InjectRepository(Participant) private readonly participantsRepository: Repository<Participant>,
  ) {}

  async save(participant: Participant) {
    return this.participantsRepository.save(participant);
  }

  async findByPublicId(ParticipantId: string) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .select('participant.id')
      .where('participant.publicId = :publicId', { publicId: ParticipantId })
      .getOne();
  }
}
