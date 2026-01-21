import { IsEnum, IsOptional, IsString } from 'class-validator';

import { MissionResult } from '../entities/mission-result.entity';
import { MissionResultStatus } from '../enums';

export class MissionResultDetailDto {
  @IsString()
  id: string;

  @IsEnum(MissionResultStatus)
  status: MissionResultStatus;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsString()
  missionId: string;

  @IsOptional()
  @IsString()
  presignedUrl: string;

  // TODO : 추후 로그 분석 결과 필드 추가 예정

  constructor() {}

  static fromMissionResultEntity(missionResult: MissionResult, presignedUrl: string) {
    const dto = new MissionResultDetailDto();
    dto.id = missionResult.publicId;
    dto.status = missionResult.status;
    dto.feedback = missionResult.feedback;
    dto.missionId = missionResult.mission.publicId;
    dto.presignedUrl = presignedUrl;
    return dto;
  }
}
