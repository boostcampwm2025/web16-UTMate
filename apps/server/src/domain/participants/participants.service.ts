import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';

import { CompleteParticipantDto } from './dto/complete-participant.dto';
import { ParticipantDto } from './dto/participant.dto';
import { Participant } from './entities/participant.entity';
import { PARTICIPANT_QUEUE, PARTICIPANT_TIMEOUT } from './const';
import { ParticipantsRepository } from './participants.repository';

import { MissionResultsService } from '#domain/mission-result/misson-results.service';
import { Mission } from '#domain/tests/entities/mission.entity';
import { DeviceInfo } from '#domain/tests/interface';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject() private readonly participantsRepository: ParticipantsRepository,
    @Inject() private readonly missionResultsService: MissionResultsService,
    @Inject() private readonly dataSource: DataSource,
    @InjectQueue(PARTICIPANT_QUEUE) private readonly participantQueue: Queue,
  ) {}

  /**
   * 참가자 생성 및 각 미션에 대한 미션 결과를 생성합니다.
   * 참가자 생성과 미션 결과 생성은 하나의 트랜잭션으로 처리됩니다.
   * 미션 결과 생성은 MissionResultsService에 위임합니다.
   *
   * @param userId 참가자 userId (Optional)
   * @param testId 테스트 id
   * @param missions 미션 배열
   * @returns 생성된 참가자 정보 및 미션 결과 배열
   */
  async createParticipant(
    userId: number | undefined,
    testId: number,
    missions: Mission[],
    deviceInfo: DeviceInfo,
  ) {
    return await this.dataSource.transaction(async (manager) => {
      // Participant 생성
      const participant = Participant.create(userId, testId, deviceInfo);
      const savedParticipant = await this.participantsRepository.save(participant, manager);

      // 각 미션에 대해 MissionResult 생성
      const missionResults = await this.missionResultsService.createMissionResults(
        missions,
        savedParticipant.id,
        manager,
      );

      // 참가자 타임아웃 작업 큐에 추가
      await this.participantQueue.add(
        'check-timeout',
        { participantId: participant.id },
        { delay: PARTICIPANT_TIMEOUT, jobId: `complete-participant-${participant.id}` },
      );

      return ParticipantDto.fromEntity(savedParticipant, missionResults);
    });
  }

  /**
   * PublicId로 참가자와 해당 참가자의 미션 결과들을 조회합니다.
   *
   * @param publicId 참가자 publicId
   * @returns 참가자 정보 및 미션 결과 배열
   * @throws NotFoundException 참가자를 찾을 수 없는 경우
   */
  async getParticipantWithMissionResults(publicId: string) {
    const participant = await this.participantsRepository.findByPublicId(publicId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const missionResults = await this.missionResultsService.getMissionResultsByParticipantId(
      participant.id,
    );

    return ParticipantDto.fromEntity(participant, missionResults);
  }

  /**
   * 참가자의 상태 및 피드백을 완료 상태로 업데이트합니다.
   *
   * @param publicId 참가자 publicId
   * @param dto 완료 상태 및 피드백 정보
   * @throws NotFoundException 참가자를 찾을 수 없는 경우
   * @throws BadRequestException 잘못된 상태로 변경하려는 경우
   */
  async completeParticipant(publicId: string, dto: CompleteParticipantDto) {
    const participant = await this.participantsRepository.findByPublicId(publicId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    try {
      participant.complete(dto.status, dto.feedback);
      await this.participantsRepository.save(participant);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
