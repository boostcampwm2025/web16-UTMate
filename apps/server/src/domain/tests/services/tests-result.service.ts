import { Injectable, NotFoundException } from '@nestjs/common';

import { MainFeedbackDto, ParticipantResultsDto, TestMissionsResultsDto } from '../dto/result.dto';
import { TestResultSummaryDto } from '../dto/test-result-summary.dto';
import { TestsRepository } from '../tests.repository';

@Injectable()
export class TestsResultService {
  constructor(private readonly testsRepository: TestsRepository) {}

  /**
   * 테스트 결과 요약 정보를 조회합니다.
   *
   * @param userId 테스트 소유자 id
   * @param publicId 테스트 public id
   * @returns 테스트 결과 요약 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자가 아닌 경우
   */
  async getTestResultSummary(userId: number, publicId: string) {
    const test = await this.testsRepository.findByPublicIdAndUserIdWithParticipants(
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
    const test = await this.testsRepository.findByPublicIdAndUserIdWithRelations(publicId, userId);
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
    const test = await this.testsRepository.findByPublicIdAndUserIdWithParticipants(
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
    const test = await this.testsRepository.findForParticipantReport(
      publicId,
      participantId,
      userId,
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
    const test = await this.testsRepository.findByPublicIdAndUserIdWithMissionsAndResults(
      publicId,
      userId,
    );
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return TestMissionsResultsDto.fromTest(test);
  }
}
