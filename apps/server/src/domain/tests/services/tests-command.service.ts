import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { UpdateTestDto } from '../dto/update-test.dto';
import { Test } from '../entities/test.entity';
import { TestStatus } from '../enums';
import { TestsRepository } from '../tests.repository';

import { ENV_KEYS } from '#common/config/env.constants';
import { MissionsService } from '#domain/missions/missions.service';

@Injectable()
export class TestsCommandService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly missionsService: MissionsService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 테스트를 생성합니다.
   *
   * @param ownerId 테스트 소유자 id
   * @param title 테스트 제목
   * @returns 생성된 테스트의 public id
   */
  async createTest(ownerId: number, title: string) {
    const test = Test.createTest(title, ownerId);
    const savedTest = await this.testsRepository.save(test);
    return savedTest.publicId;
  }

  /**
   * 테스트와 해당 테스트의 미션들을 업데이트합니다.
   * 하나의 트랜잭션 내에서 테스트 업데이트와 미션 업데이트를 처리합니다.
   * 미션 업데이트는 MissionsService에 위임합니다.
   *
   * @param userId 사용자 id
   * @param publicId 테스트 public id
   * @param dto 업데이트할 테스트 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 테스트에 접근할 권한이 없는 경우
   */
  async updateTest(userId: number, publicId: string, dto: UpdateTestDto) {
    // 트랜잭션 시작
    await this.dataSource.transaction(async (manager) => {
      // 테스트 업데이트
      const test = await this.testsRepository.findByPublicIdAndUserId(publicId, userId, manager);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      if (test.status !== TestStatus.DRAFT) {
        throw new BadRequestException('테스트는 DRAFT 상태에서만 수정할 수 있습니다');
      }

      test.updateTestInfo(dto.title, dto.description, dto.url, dto.isPublic);
      test.updateTargeting(dto.targetGenders, dto.targetAges, dto.targetInterests);
      await this.testsRepository.save(test, manager);

      // 미션 업데이트
      if (dto.missions) {
        await this.missionsService.updateMissions(test.id, dto.missions, manager);
      }

      return { success: true };
    });
  }

  /**
   * 테스트를 삭제합니다.
   *
   * @param userId 사용자 id
   * @param publicId 테스트 public id
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async deleteTest(userId: number, publicId: string) {
    // 테스트 삭제
    // 관련된 미션들은 Test 엔티티의 onDelete: 'CASCADE' 옵션에 의해 자동 삭제됨
    const test = await this.testsRepository.findByPublicIdAndUserId(publicId, userId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.ownerId !== userId) {
      throw new ForbiddenException('테스트 삭제 권한이 없습니다');
    }
    await this.testsRepository.remove(test);
  }

  /**
   * 테스트 상태를 업데이트합니다.
   *
   * @param userId 사용자 id
   * @param publicId 테스트 public id
   * @param status 업데이트할 테스트 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   * @throws BadRequestException 잘못된 상태로 변경하려는 경우
   */
  async updateTestStatus(userId: number, publicId: string, status: TestStatus) {
    const test = await this.testsRepository.findByPublicIdAndUserIdWithMissions(publicId, userId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (test.status === TestStatus.DEMO) {
      throw new BadRequestException('DEMO 테스트는 상태를 변경할 수 없습니다');
    }

    try {
      test.transitionStatus(status);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    await this.testsRepository.save(test);
  }

  /**
   * SDK 설치를 검증합니다.
   *
   * @param userId 사용자 id
   * @param publicId 테스트 public id
   * @returns SDK 설치 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async verifySdkInstallation(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndUserId(publicId, userId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // SDK 설치 여부 검증 로직
    const isSdkInstalled = await this.verifySdkInstallationLogic(test.url);
    test.sdkStatus = isSdkInstalled;
    await this.testsRepository.save(test);

    return { sdkStatus: test.sdkStatus };
  }

  /**
   * SDK 설치 여부를 검증하는 실제 로직입니다.
   * fetch를 사용하여 테스트 URL에 접근하고, 페이지 내에 SDK 스크립트가 포함되어 있는지 정규식을 통해 확인합니다.
   *
   * @param destination 테스트 URL
   * @returns SDK 설치 여부
   */
  private async verifySdkInstallationLogic(destination: string): Promise<boolean> {
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
  }

  /**
   * SDK를 통해 테스트의 SDK 설치 정보를 업데이트합니다.
   *
   * @param publicId 테스트 public id
   * @throws NotFoundException 테스트를 찾을 수 없는 경우
   */
  async verifySdkInstallationBySDK(publicId: string) {
    const affectedRows = await this.testsRepository.updateSdkStatus(publicId, true);
    if (affectedRows === 0) {
      throw new NotFoundException('Test not found');
    }
  }
}
