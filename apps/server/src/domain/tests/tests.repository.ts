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
    return repo.findOne({ where: { publicId, owner } });
  }
}
