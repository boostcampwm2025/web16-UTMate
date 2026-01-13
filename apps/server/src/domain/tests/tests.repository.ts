import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Test } from './entities/test.entity';

import { User } from '#domain/users/entities/user.entity';

@Injectable()
export class TestsRepository {
  constructor(@InjectRepository(Test) private readonly testsRepository: Repository<Test>) {}

  async save(test: Test, manager?: EntityManager): Promise<Test> {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo.save(test);
  }

  async findByPublicIdAndOwner(publicId: string, owner: User, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo
      .createQueryBuilder('tests')
      .where('tests.publicId = :publicId', { publicId })
      .andWhere('tests.owner_id = :ownerId', { ownerId: owner.id })
      .getOne();
  }

  async findSummariesByOwner(owner: User, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo
      .createQueryBuilder('tests')
      .select([
        'tests.publicId',
        'tests.title',
        'tests.status',
        'tests.sdkStatus',
        'tests.url',
        'owner.publicId',
        'owner.username',
        'owner.avatarUrl',
      ])
      .leftJoin('tests.owner', 'owner')
      .where('tests.owner_id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async findSdkStatusByPublicIdAndOwner(publicId: string, owner: User, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo
      .createQueryBuilder('tests')
      .select(['tests.sdkStatus'])
      .where('tests.publicId = :publicId', { publicId })
      .andWhere('tests.owner_id = :ownerId', { ownerId: owner.id })
      .getOne();
  }

  async findWithMissionsByPublicIdAndOwner(publicId: string, owner: User, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo
      .createQueryBuilder('tests')
      .leftJoinAndSelect('tests.missions', 'mission')
      .where('tests.publicId = :publicId', { publicId })
      .andWhere('tests.owner_id = :ownerId', { ownerId: owner.id })
      .getOne();
  }

  async remove(test: Test, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    return repo.remove(test);
  }

  async updateSdkStatus(publicId: string, sdkStatus: boolean, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Test) : this.testsRepository;
    const result = await repo
      .createQueryBuilder()
      .update(Test)
      .set({ sdkStatus })
      .where('publicId = :publicId', { publicId })
      .execute();

    return result.affected || 0;
  }
}
