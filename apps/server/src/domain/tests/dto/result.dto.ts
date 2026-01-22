import { InternalServerErrorException, Logger } from '@nestjs/common';

import { Mission } from '../entities/mission.entity';

import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';
import { MissionResultStatus } from '#domain/mission-result/enums';
import { Participant } from '#domain/participants/entities/participant.entity';

export class ParticipantMissionResultDto {
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
  content: string;

  static fromEntity(participant: Participant) {
    if (!participant.feedback) {
      return null;
    }
    const dto = new MainFeedbackDto();
    dto.content = participant.feedback;
    return dto;
  }

  static fromEntities(participants: Participant[]) {
    return participants
      .map((p) => this.fromEntity(p))
      .filter((feedback): feedback is MainFeedbackDto => feedback !== null);
  }
}

export class MissionResultOverviewDto {
  id: string;
  status: MissionResultStatus;
  duration?: number;
  feedback?: string;

  // 참가자 정보
  participantId: string;
  persona: string;

  static fromEntity(missionResult: MissionResult) {
    const dto = new MissionResultOverviewDto();
    dto.id = missionResult.publicId;
    dto.status = missionResult.status;
    dto.duration = missionResult.duration;
    dto.feedback = missionResult.feedback;

    dto.participantId = missionResult.participant.publicId;
    dto.persona = 'GUEST'; // TODO: 참가자 페르소나 기능 구현 시 수정 필요
    return dto;
  }

  static fromEntities(missionResults: MissionResult[]) {
    return missionResults.map((mr) => this.fromEntity(mr));
  }
}

export class MissionOverviewDto {
  id: string;
  missionOrder: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number;

  averageDuration: number;
  averageIdleTime: number;
  averageRageClickCount: number;
  averageMouseThrashingCount: number;

  missionResults: MissionResultOverviewDto[];

  static fromEntity(missions: Mission) {
    const dto = new MissionOverviewDto();
    dto.id = missions.publicId;
    dto.missionOrder = missions.order;
    dto.name = missions.name;
    dto.description = missions.description;
    dto.missionUrl = missions.missionUrl;
    dto.estimatedDuration = missions.estimatedDuration;

    dto.averageDuration =
      missions.missionResults.filter((mr) => mr.duration !== null).length > 0
        ? Math.round(
            missions.missionResults.reduce((acc, curr) => acc + (curr.duration || 0), 0) /
              missions.missionResults.filter((mr) => mr.duration !== null).length,
          )
        : 0;

    dto.averageIdleTime =
      missions.missionResults.filter((mr) => mr.totalIdleTime !== null).length > 0
        ? Math.round(
            missions.missionResults.reduce((acc, curr) => acc + (curr.totalIdleTime || 0), 0) /
              missions.missionResults.filter((mr) => mr.totalIdleTime !== null).length,
          )
        : 0;

    dto.averageRageClickCount =
      missions.missionResults.filter((mr) => mr.rageClickCount !== null).length > 0
        ? Math.round(
            missions.missionResults.reduce((acc, curr) => acc + (curr.rageClickCount || 0), 0) /
              missions.missionResults.filter((mr) => mr.rageClickCount !== null).length,
          )
        : 0;

    dto.averageMouseThrashingCount =
      missions.missionResults.filter((mr) => mr.mouseThrashingCount !== null).length > 0
        ? Math.round(
            missions.missionResults.reduce(
              (acc, curr) => acc + (curr.mouseThrashingCount || 0),
              0,
            ) / missions.missionResults.filter((mr) => mr.mouseThrashingCount !== null).length,
          )
        : 0;
    dto.missionResults = MissionResultOverviewDto.fromEntities(missions.missionResults);

    return dto;
  }
}
