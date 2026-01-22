import { InternalServerErrorException, Logger } from '@nestjs/common';

import { Mission } from '../entities/mission.entity';

import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';
import { MissionResultStatus } from '#domain/mission-result/enums';
import { Participant } from '#domain/participants/entities/participant.entity';

export class ParticipantMissionResultDto {
  missionResultId: string;
  missionId: string;
  missionOrder: number;
  status: MissionResultStatus;
  duration?: number;
  feedback?: string;
  createdAt?: Date;

  static fromEntity(missions: Mission[], missionResult: MissionResult) {
    const dto = new ParticipantMissionResultDto();
    const mission = missions.find((m) => m.id === missionResult.missionId);
    if (!mission) {
      Logger.error(
        `연관 미션을 찾을 수 없는 미션 결과가 존재합니다. missionResultId: ${missionResult.id}, missionId: ${missionResult.missionId}`,
      );
      throw new InternalServerErrorException(`미션 정보를 불러오는 중 오류가 발생했습니다.`);
    }
    dto.missionResultId = missionResult.publicId;
    dto.missionId = mission.publicId;
    dto.missionOrder = mission.order;
    dto.status = missionResult.status;
    dto.duration = missionResult.duration;
    dto.feedback = missionResult.feedback;
    dto.createdAt = missionResult.createdAt;
    return dto;
  }

  static fromEntities(
    missions: Mission[],
    missionResults: MissionResult[],
  ): ParticipantMissionResultDto[] {
    return missionResults.map((mr) => this.fromEntity(missions, mr));
  }
}

export class ParticipantResultsDto {
  participantId: string;
  persona: string;
  missionResults: ParticipantMissionResultDto[];

  static fromEntity(participant: Participant, missions: Mission[]) {
    const dto = new ParticipantResultsDto();
    dto.participantId = participant.publicId;
    // TODO : 참가자 페르소나 기능 구현 시 수정 필요
    dto.persona = 'GUEST';
    dto.missionResults = ParticipantMissionResultDto.fromEntities(
      missions,
      participant.missionResults,
    );
    return dto;
  }

  static fromEntities(participants: Participant[], missions: Mission[]) {
    return participants.map((p) => this.fromEntity(p, missions));
  }
}

export class MainFeedbackDto {
  participantId: string;
  content: string;
  createdAt: Date;

  static fromEntity(participant: Participant) {
    if (!participant.feedback) {
      return null;
    }
    const dto = new MainFeedbackDto();
    dto.participantId = participant.publicId;
    dto.content = participant.feedback;
    dto.createdAt = participant.joinedAt;
    return dto;
  }

  static fromEntities(participants: Participant[]) {
    return participants
      .map((p) => this.fromEntity(p))
      .filter((feedback): feedback is MainFeedbackDto => feedback !== null);
  }
}

export class MissionOverviewDto {
  missionId: string;
  missionOrder: number;
  status: MissionResultStatus;
  duration?: number;
  feedback?: string;
  createdAt?: Date;

  participantId: string;
  persona: string;

  static fromEntity(missions: Mission, missionResult: MissionResult) {
    const dto = new MissionOverviewDto();
    dto.missionId = missions.publicId;
    dto.missionOrder = missions.order;
    dto.status = missionResult.status;
    dto.duration = missionResult.duration;
    dto.feedback = missionResult.feedback;
    dto.createdAt = missionResult.createdAt;

    dto.participantId = missionResult.participant.publicId;
    // TODO : 참가자 페르소나 기능 구현 시 수정 필요
    dto.persona = 'GUEST';
    return dto;
  }

  static fromEntities(mission: Mission, missionResults: MissionResult[]) {
    return missionResults.map((mr) => this.fromEntity(mission, mr));
  }
}
