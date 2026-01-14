import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { TestDto } from './dto/test.dto';
import { TestSummaryDto } from './dto/test-summary.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test, TestStatus } from './entities/test.entity';
import { MissionsService } from './missions.service';
import { TestsRepository } from './tests.repository';

import { ENV_KEYS } from '#common/config/env.constants';
import { UsersService } from '#domain/users/users.service';

@Injectable()
export class TestsService {
  constructor(
    @Inject() private readonly testsRepository: TestsRepository,
    @Inject() private readonly usersService: UsersService,
    @Inject() private readonly missionsService: MissionsService,
    @Inject() private readonly dataSource: DataSource,
    @Inject() private readonly configService: ConfigService,
  ) {}

  async createTest(ownerId: number, title: string) {
    const test = Test.createTest(title, ownerId);
    const savedTest = await this.testsRepository.save(test);
    return savedTest.publicId;
  }

  async updateTest(ownerId: number, publicId: string, updateTestDto: UpdateTestDto) {
    // 트랜잭션 시작
    await this.dataSource.transaction(async (manager) => {
      // 테스트 업데이트
      const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId, manager);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      test.update(updateTestDto.title, updateTestDto.description, updateTestDto.url);
      await this.testsRepository.save(test, manager);

      // 미션 업데이트
      if (updateTestDto.missions) {
        await this.missionsService.updateMissions(test, updateTestDto.missions, manager);
      }

      return { success: true };
    });
  }

  async getMyTests(ownerId: number) {
    const test = await this.testsRepository.findSummariesByOwner(ownerId);
    return TestSummaryDto.fromTestEntities(test);
  }

  async getTestById(ownerId: number, publicId: string) {
    const test = await this.testsRepository.findWithMissionsByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return TestDto.fromTestEntity(test);
  }

  async getSdkStatus(ownerId: number, publicId: string) {
    const test = await this.testsRepository.findSdkStatusByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return { sdkStatus: test.sdkStatus };
  }

  async deleteTest(ownerId: number, publicId: string) {
    // 테스트 삭제
    // 관련된 미션들은 Test 엔티티의 onDelete: 'CASCADE' 옵션에 의해 자동 삭제됨
    const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    await this.testsRepository.remove(test);
  }

  async updateTestStatus(ownerId: number, publicId: string, status: TestStatus) {
    const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    try {
      test.handleStatusChange(status);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    await this.testsRepository.save(test);
  }

  async verifySdkInstallation(ownerId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // SDK 설치 여부 검증 로직
    const isSdkInstalled = await this.verifySdkInstallationLogic(test.url); // 실제 검증 로직으로 대체 필요
    test.sdkStatus = isSdkInstalled;
    await this.testsRepository.save(test);

    return { sdkStatus: test.sdkStatus };
  }

  private async verifySdkInstallationLogic(destination: string): Promise<boolean> {
    try {
      const response = await fetch(destination);
      if (!response.ok) {
        return false;
      }

      const html = await response.text();

      // <script> 태그에서만 src 속성 찾기
      // <script src="..." 패턴만 매칭
      const scriptTagPattern = /<script\s+[^>]*src=["']([^"']*)/gi;
      const matches = html.match(scriptTagPattern);

      if (!matches) {
        return false;
      }

      // SDK URL 확인
      const sdkDomain = this.configService.get(ENV_KEYS.SDK_DOMAIN); // SDK 도메인 패턴
      return matches.some((match) => match.toLowerCase().includes(sdkDomain));
    } catch (error) {
      return false;
    }
  }

  async verifySdkInstallationBySDK(publicId: string) {
    const affectedRows = await this.testsRepository.updateSdkStatus(publicId, true);
    if (affectedRows === 0) {
      throw new NotFoundException('Test not found');
    }
  }
}
