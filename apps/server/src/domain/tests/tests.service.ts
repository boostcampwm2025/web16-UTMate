import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { MissionsService } from './missions.service';
import { TestsRepository } from './tests.repository';

import { UsersService } from '#domain/users/users.service';

@Injectable()
export class TestsService {
  constructor(
    @Inject() private readonly testsRepository: TestsRepository,
    @Inject() private readonly usersService: UsersService,
    @Inject() private readonly missionsService: MissionsService,
    @Inject() private readonly dataSource: DataSource,
  ) {}

  async createTest(userId: string, title: string) {
    const owner = await this.usersService.getIdByPublicId(userId);
    const test = Test.createTest(title, owner);
    const savedTest = await this.testsRepository.save(test);
    return savedTest.publicId;
  }

  async updateTest(userId: string, publicId: string, updateTestDto: UpdateTestDto) {
    const owner = await this.usersService.getIdByPublicId(userId);

    // 트랜잭션 시작
    return await this.dataSource.transaction(async (manager) => {
      // 테스트 업데이트
      const test = await this.testsRepository.findByPublicIdAndOwner(publicId, owner, manager);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      test.update(updateTestDto.title, updateTestDto.description, updateTestDto.url);
      await this.testsRepository.save(test, manager);

      // 미션 업데이트
      if (updateTestDto.missions) {
        await this.missionsService.updateMissions(test, updateTestDto.missions, manager);
      }

      return;
    });
  }
}
