import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { MissionResult } from './entities/mission-result.entity';

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

  async findByParticipantIdWithMissions(participantId: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(MissionResult) : this.repository;
    return repo
      .createQueryBuilder('missionResult')
      .where('missionResult.participant_id = :participantId', { participantId })
      .leftJoinAndSelect('missionResult.mission', 'mission')
      .orderBy('mission.order', 'ASC')
      .getMany();
  }

  async findByParticipantId(participantId: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(MissionResult) : this.repository;
    return repo
      .createQueryBuilder('missionResult')
      .where('missionResult.participant_id = :participantId', { participantId })
      .getMany();
  }

  findByPublicIdWithAllRelations(publicId: string) {
    return this.repository
      .createQueryBuilder('missionResult')
      .leftJoinAndSelect('missionResult.participant', 'participant')
      .leftJoinAndSelect('missionResult.mission', 'mission')
      .leftJoinAndSelect('participant.test', 'test')
      .leftJoinAndSelect('participant.member', 'member')
      .where('missionResult.publicId = :publicId', { publicId })
      .getOne();
  }
}
