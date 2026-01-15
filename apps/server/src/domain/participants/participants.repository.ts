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

  async findByPublicId(publicId: string) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .select('participant.id')
      .where('participant.publicId = :publicId', { publicId })
      .getOne();
  }

  findByPublicIdWithMissionResults(publicId: string) {
    return this.participantsRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.missionResults', 'missionResults')
      .where('participant.publicId = :publicId', { publicId })
      .getOne();
  }
}
