import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { MissionResult } from './entities/mission-result.entity';
import { MissionResultStatus } from './enums';

@Injectable()
export class MissionResultsRepository {
  constructor(
    @InjectRepository(MissionResult) private readonly repository: Repository<MissionResult>,
  ) {}

  async save(missionResult: MissionResult): Promise<MissionResult> {
    return this.repository.save(missionResult);
  }

  async saveAll(missionResults: MissionResult[], manager?: EntityManager) {
    const repo = manager ? manager.getRepository(MissionResult) : this.repository;
    return repo.save(missionResults);
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

  async findByParticipantIdWithMissions(participantId: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(MissionResult) : this.repository;
    return repo
      .createQueryBuilder('missionResult')
      .where('missionResult.participant_id = :participantId', { participantId })
      .leftJoinAndSelect('missionResult.mission', 'mission')
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
