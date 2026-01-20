import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Mission } from './entities/mission.entity';
import { Test } from './entities/test.entity';

@Injectable()
export class MissionRepository {
  constructor(@InjectRepository(Mission) private readonly missionRepository: Repository<Mission>) {}

  async save(mission: Mission, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Mission) : this.missionRepository;
    return repo.save(mission);
  }

  async findAllByTest(test: Test, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Mission) : this.missionRepository;
    return repo.findBy({ test });
  }

  async saveAll(missions: Mission[], manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Mission) : this.missionRepository;
    return repo.save(missions);
  }

  async deleteAll(missions: Mission[], manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Mission) : this.missionRepository;
    const ids = missions.map((mission) => mission.id);
    return repo.delete(ids);
  }

  findByPublicId(publicId: string) {
    return this.missionRepository.findOneBy({ publicId });
  }

  findByPublicIdWithAllRelations(missionId: string) {
    return this.missionRepository
      .createQueryBuilder('missions')
      .leftJoinAndSelect('missions.test', 'test')
      .leftJoinAndSelect('missions.missionResults', 'missionResults')
      .leftJoinAndSelect('missionResults.participant', 'participant')
      .where('missions.publicId = :missionId', { missionId })
      .getOne();
  }
}
