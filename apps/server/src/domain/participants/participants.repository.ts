import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsRepository {
  constructor(
    @InjectRepository(Participant) private readonly participantsRepository: Repository<Participant>,
  ) {}

  async save(participant: Participant, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Participant) : this.participantsRepository;
    return repo.save(participant);
  }

  async findByPublicId(publicId: string) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .select('participant.id')
      .where('participant.publicId = :publicId', { publicId })
      .getOne();
  }
}
