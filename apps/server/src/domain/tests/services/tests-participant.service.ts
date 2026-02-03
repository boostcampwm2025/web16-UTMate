import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { TestStatus } from '../enums';
import { TestsRepository } from '../tests.repository';

import { ParticipantsService } from '#domain/participants/participants.service';

@Injectable()
export class TestsParticipantService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly participantsService: ParticipantsService,
  ) {}

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
}
