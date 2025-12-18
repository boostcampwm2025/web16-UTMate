import path from 'path';

import { PickType } from '@nestjs/mapped-types';

import { MissionResult, MissionResultStatus } from '../entities/mission-result.entity';

import { S3_URL } from '#common/storage/const';

export class MissionResultDto {
  id: number;
  participantId: string;
  missionId: string;
  status: MissionResultStatus;
  duration: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;

  // TODO 추가적으로 로그 분석하여 저장할 필드 정의
  logUrl?: string;

  static fromEntity(missionResult: MissionResult) {
    const dto = new MissionResultDto();
    dto.id = missionResult.id;
    dto.participantId = missionResult.participantId;
    dto.missionId = missionResult.missionId;
    dto.status = missionResult.status;
    dto.duration = missionResult.duration;
    dto.feedback = missionResult.feedback;
    dto.createdAt = missionResult.createdAt;
    dto.updatedAt = missionResult.updatedAt;

    dto.logUrl = path.join(S3_URL, missionResult.logUrl || '');
    return dto;
  }
}

export class SimpleMissionResultDto extends PickType(MissionResultDto, [
  'id',
  'participantId',
  'missionId',
] as const) {
  static fromEntity(missionResult: MissionResult) {
    const dto = new SimpleMissionResultDto();
    dto.id = missionResult.id;
    dto.participantId = missionResult.participantId;
    dto.missionId = missionResult.missionId;
    return dto;
  }

  static fromEntities(missionResults: MissionResult[]) {
    return missionResults.map((mr) => this.fromEntity(mr));
  }
}
