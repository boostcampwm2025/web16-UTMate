import { Inject, Injectable } from '@nestjs/common';

import { Test } from './entities/test.entity';
import { TestsRepository } from './tests.repository';

import { UsersService } from '#domain/users/users.service';

@Injectable()
export class TestsService {
  constructor(
    @Inject() private readonly testsRepository: TestsRepository,
    @Inject() private readonly usersService: UsersService,
  ) {}

  async createTest(userId: string, title: string) {
    const owner = await this.usersService.getIdByPublicId(userId);
    const test = Test.createTest(title, owner);
    const savedTest = await this.testsRepository.save(test);
    return savedTest.publicId;
  }
}
