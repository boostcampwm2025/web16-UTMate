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

  async findById(id: number) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .where('participant.id = :id', { id })
      .getOne();
  }

  async findByPublicId(publicId: string) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .where('participant.publicId = :publicId', { publicId })
      .getOne();
  }
}
