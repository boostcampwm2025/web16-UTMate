import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Test } from './entities/test.entity';

@Injectable()
export class TestsRepository {
  constructor(@InjectRepository(Test) private readonly testsRepository: Repository<Test>) {}

  async save(test: Test): Promise<Test> {
    return this.testsRepository.save(test);
  }
}
