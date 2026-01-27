import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { MainFeedbackDto, ParticipantResultsDto, TestMissionsResultsDto } from './dto/result.dto';
import { TestDto } from './dto/test.dto';
import { TestResultSummaryDto } from './dto/test-result-summary.dto';
import { TestSummaryDto } from './dto/test-summary.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test, TestStatus } from './entities/test.entity';
import { MissionsService } from './missions.service';
import { TestsRepository } from './tests.repository';

import { ENV_KEYS } from '#common/config/env.constants';
import { ParticipantsService } from '#domain/participants/participants.service';

@Injectable()
export class TestsService {
  constructor(
    @Inject() private readonly testsRepository: TestsRepository,
    @Inject() private readonly missionsService: MissionsService,
    @Inject() private readonly participantsService: ParticipantsService,
    @Inject() private readonly dataSource: DataSource,
    @Inject() private readonly configService: ConfigService,
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
   * @param ownerId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @param updateTestDto 업데이트할 테스트 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
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

  /**
   * 내가 소유한 테스트들을 요약 정보만 조회합니다.
   *
   * @param ownerId 테스트 소유자 id
   * @returns 테스트 요약 DTO 배열
   */
  async getMyTests(ownerId: number) {
    const tests = await this.testsRepository.findSummariesByOwner(ownerId);
    return TestSummaryDto.fromTestEntities(tests);
  }

  /**
   * 특정 테스트의 상세 정보를 조회합니다.
   * 공개된 테스트이거나, 소유자가 조회하는 경우에만 접근을 허용합니다.
   *
   * @param ownerId 테스트 소유자 id (Optional)
   * @param publicId 테스트 public id
   * @returns 테스트 DTO
   * @throws NotFoundException 테스트를 찾을 수 없는 경우
   * @throws ForbiddenException 공개 상태가 아닌 테스트에 대해 소유자가 이외의 사용자가 접근하는 경우
   */
  async getTestById(ownerId: number | undefined, publicId: string) {
    const test = await this.testsRepository.findByPublicIdWithMissions(publicId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (test.status === TestStatus.PUBLISHED) return TestDto.fromTestEntity(test);

    if (test.ownerId !== ownerId) {
      throw new ForbiddenException('Test not found');
    }
    return TestDto.fromTestEntity(test);
  }

  /**
   * SDK의 설치 상태만 조회합니다.
   *
   * @param ownerId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns SDK 설치 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getSdkStatus(ownerId: number, publicId: string) {
    const test = await this.testsRepository.findSdkStatusByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return { sdkStatus: test.sdkStatus };
  }

  /**
   * 테스트를 삭제합니다.
   *
   * @param ownerId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async deleteTest(ownerId: number, publicId: string) {
    // 테스트 삭제
    // 관련된 미션들은 Test 엔티티의 onDelete: 'CASCADE' 옵션에 의해 자동 삭제됨
    const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    await this.testsRepository.remove(test);
  }

  /**
   * 테스트 상태를 업데이트합니다.
   *
   * @param ownerId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @param status 업데이트할 테스트 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   * @throws BadRequestException 잘못된 상태로 변경하려는 경우
   */
  async updateTestStatus(ownerId: number, publicId: string, status: TestStatus) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithMissions(publicId, ownerId);
    if (!test) {
      throw new NotFoundException('Test not found');
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
   * @param ownerId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns SDK 설치 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async verifySdkInstallation(ownerId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwner(publicId, ownerId);
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

  /**
   * 테스트에 참여자를 생성합니다.
   * 참여자 생성은 ParticipantsService에 위임합니다.
   *
   * @param userId 사용자 id (Optional)
   * @param publicId 테스트 public id
   * @returns 참여자 정보 및 미션 결과 배열
   * @throws NotFoundException 테스트를 찾을 수 없는 경우
   * @throws BadRequestException 테스트가 게시되지 않은 경우
   */
  async participateTest(userId: number | undefined, publicId: string, uaInfo: UAParser.IResult) {
    const test = await this.testsRepository.findByPublicIdWithMissions(publicId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (test.status !== TestStatus.PUBLISHED) {
      throw new BadRequestException('Test is not published');
    }
    return this.participantsService.createParticipant(userId, test.id, test.missions, uaInfo);
  }

  /**
   * 테스트 결과 요약 정보를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns 테스트 결과 요약 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestResultSummary(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithParticipants(
      publicId,
      userId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return TestResultSummaryDto.fromTest(test);
  }

  /**
   * 테스트 참여자들의 미션 결과들을 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns 테스트 참여자들의 미션 결과 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestParticipantsResults(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithAllRelations(
      publicId,
      userId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return ParticipantResultsDto.fromEntities(test.participants, test.missions);
  }

  /**
   * 테스트의 참가자들의 피드백을 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns 주요 피드백 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestMainFeedback(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithParticipants(
      publicId,
      userId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return MainFeedbackDto.fromEntities(test.participants);
  }

  /**
   * 특정 테스트의 특정 참여자 상세 정보를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @param participantId 참여자 public id
   * @returns 참여자 상세 정보 DTO
   * @throws NotFoundException 테스트 또는 참여자를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestParticipantDetail(userId: number, publicId: string, participantId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithParticipant(
      publicId,
      userId,
      participantId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    if (!test.participants || test.participants.length === 0) {
      throw new NotFoundException('Participant not found');
    }
    return ParticipantResultsDto.fromEntity(test.participants[0], test.missions);
  }

  /**
   * 테스트의 모든 미션과 각 미션의 결과를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns 테스트의 모든 미션과 각 미션의 결과 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestMissionsResults(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndOwnerWithMissionsAndResults(
      publicId,
      userId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return TestMissionsResultsDto.fromTest(test);
  }
}
