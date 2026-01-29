import { InternalServerErrorException, Logger } from '@nestjs/common';

import { Test } from '../entities/test.entity';

import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';
import { MissionResultStatus } from '#domain/mission-result/enums';
import { Mission } from '#domain/missions/entities/mission.entity';
import { Participant } from '#domain/participants/entities/participant.entity';

export class ParticipantMissionResultDto {
  missionResultId: string;
  missionId: string;
  missionOrder: number;
  missionTitle: string;
  missionDescription: string;
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
    dto.missionTitle = mission.name;
    dto.missionDescription = mission.description;
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
  joinedAt: Date;
  missionResults: ParticipantMissionResultDto[];

  static fromEntity(participant: Participant, missions: Mission[]) {
    const dto = new ParticipantResultsDto();
    dto.participantId = participant.publicId;
    // TODO : 참가자 페르소나 기능 구현 시 수정 필요
    dto.persona = 'GUEST';
    dto.joinedAt = participant.joinedAt;
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
  personaTag: string[] = [];
  createdAt: Date;

  static fromEntity(participant: Participant) {
    if (!participant.feedback) {
      return null;
    }
    const dto = new MainFeedbackDto();
    dto.participantId = participant.publicId;
    dto.content = participant.feedback;
    if (participant.userType === 'REGISTERED' && participant.user) {
      if (participant.user.persona) {
        dto.personaTag.push(participant.user.persona.gender);
        dto.personaTag.push(participant.user.persona.ageGroup);
        dto.personaTag.push(...participant.user.persona.interests);
      }
    } else {
      dto.personaTag.push('GUEST');
    }
    dto.createdAt = participant.joinedAt;
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
  // 미션 정보
  id: string;
  missionOrder: number;
  name: string;
  description: string;
  missionUrl: string;
  estimatedDuration: number;

  // 통계 정보
  successRate: number;
  dropRate: number;
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

    dto.successRate =
      missions.missionResults.length > 0
        ? Math.round(
            (missions.missionResults.filter((mr) => mr.status === MissionResultStatus.SUCCESS)
              .length /
              missions.missionResults.length) *
              100,
          )
        : 0;

    dto.dropRate =
      missions.missionResults.length > 0
        ? Math.round(
            (missions.missionResults.filter((mr) => mr.status === MissionResultStatus.PENDING)
              .length /
              missions.missionResults.length) *
              100,
          )
        : 0;

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
        ? missions.missionResults.reduce((acc, curr) => acc + (curr.rageClickCount || 0), 0) /
          missions.missionResults.filter((mr) => mr.rageClickCount !== null).length
        : 0;

    dto.averageMouseThrashingCount =
      missions.missionResults.filter((mr) => mr.mouseThrashingCount !== null).length > 0
        ? missions.missionResults.reduce((acc, curr) => acc + (curr.mouseThrashingCount || 0), 0) /
          missions.missionResults.filter((mr) => mr.mouseThrashingCount !== null).length
        : 0;

    dto.missionResults = MissionResultOverviewDto.fromEntities(missions.missionResults);

    return dto;
  }

  static fromEntities(missions: Mission[]): MissionOverviewDto[] {
    return missions.map((mission) => this.fromEntity(mission));
  }
}

export class TestMissionsResultsDto {
  missions: MissionOverviewDto[];

  static fromTest(test: Test): TestMissionsResultsDto {
    const dto = new TestMissionsResultsDto();
    dto.missions = MissionOverviewDto.fromEntities(test.missions || []);
    return dto;
  }
}
