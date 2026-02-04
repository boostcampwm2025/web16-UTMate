import { Injectable, NotFoundException } from '@nestjs/common';

import { SearchTestQueryDto, SearchTestResponseDto } from '../dto/search-test.dto';
import { TestDto } from '../dto/test.dto';
import { TestSummaryDto } from '../dto/test-summary.dto';
import { TestStatus } from '../enums';
import { TestsRepository } from '../tests.repository';

@Injectable()
export class TestsQueryService {
  constructor(private readonly testsRepository: TestsRepository) {}

  /**
   * 특정 테스트의 상세 정보를 조회합니다.
   * 공개된 테스트이거나, 소유자가 조회하는 경우에만 접근을 허용합니다.
   *
   * @param userId 사용자 id (Optional)
   * @param publicId 테스트 public id
   * @returns 테스트 DTO
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자(맴버) 이외의 사용자가 접근하는 경우
   */
  async getTestById(userId: number | undefined, publicId: string) {
    const test = await this.testsRepository.findByPublicIdWithMembers(publicId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // 공개된 테스트인 경우 바로 반환
    if (test.status === TestStatus.PUBLISHED) return TestDto.fromTestEntity(test);

    // 비공개 테스트인 경우 소유자(맴버)인지 확인

    if (!userId) {
      throw new NotFoundException('Test not found');
    }

    if (userId !== test.ownerId && test.members.every((member) => member.id !== userId)) {
      throw new NotFoundException('Test not found');
    }

    return TestDto.fromTestEntity(test);
  }

  /**
   * 검색 쿼리에 따라 테스트를 검색합니다.
   *
   * @param query 검색 쿼리 DTO
   * @returns 검색된 테스트 DTO와 총 페이지 수
   */
  async searchTestsByQuery(query: SearchTestQueryDto) {
    const [tests, count] = await this.testsRepository.searchTestsByQuery(query);
    const totalPage = Math.ceil(count / query.limit);
    return SearchTestResponseDto.fromTestEntities(tests, totalPage);
  }

  /**
   * 소유한 테스트 혹은 공유 받은 테스트의 요약 정보만 조회합니다.
   *
   * @param userId 사용자 id
   * @returns 테스트 요약 DTO 배열
   */
  async getMyTests(userId: number) {
    const tests = await this.testsRepository.findByUserIdWithUsers(userId);

    return TestSummaryDto.fromTestEntities(tests);
  }

  /**
   * SDK의 설치 상태만 조회합니다.
   *
   * @param userId 사용자 id
   * @param publicId 테스트 public id
   * @returns SDK 설치 상태
   * @throws NotFoundException 테스트를 찾을 수 없거나 소유자(맴버) 이외의 사용자가 접근하는 경우
   */
  async getSdkStatus(userId: number, publicId: string) {
    const test = await this.testsRepository.findSdkStatusByPublicIdAndUserId(publicId, userId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return { sdkStatus: test.sdkStatus };
  }
}
