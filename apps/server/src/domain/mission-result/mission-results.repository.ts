import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MissionResult, MissionResultStatus } from './entities/mission-result.entity';

@Injectable()
export class MissionResultsRepository {
  constructor(
    @InjectRepository(MissionResult) private readonly repository: Repository<MissionResult>,
  ) {}

  async save(missionResult: MissionResult): Promise<MissionResult> {
    return this.repository.save(missionResult);
  }

  async findByPublicId(publicId: string) {
    return this.repository
      .createQueryBuilder('missionResult')
      .where('missionResult.publicId = :publicId', { publicId })
      .getOne();
  }

  async findByParticipantId(participantId: number) {
    return this.repository
      .createQueryBuilder('missionResult')
      .where('missionResult.participant_id = :participantId', { participantId })
      .getMany();
  }

  async existsPendingMissionByParticipantId(participantId: number) {
    return await this.repository
      .createQueryBuilder('missionResult')
      .where('missionResult.participant_id = :participantId', { participantId })
      .andWhere('missionResult.status = :status', { status: MissionResultStatus.PENDING })
      .getExists();
  }
}
