import { IsEnum, IsOptional, IsString } from 'class-validator';

import { MissionResult } from '../entities/mission-result.entity';
import { MissionResultStatus } from '../enums';

export class MissionResultDto {
  @IsString()
  id: string;

  @IsEnum(MissionResultStatus)
  status: MissionResultStatus;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsString()
  missionId: string;

  constructor() {}

  static fromMissionResultEntity(missionResult: MissionResult) {
    const dto = new MissionResultDto();
    dto.id = missionResult.publicId;
    dto.status = missionResult.status;
    dto.feedback = missionResult.feedback;
    dto.missionId = missionResult.mission.publicId;
    return dto;
  }

  static fromMissionResultEntities(missionResults: MissionResult[]) {
    return missionResults.map((mr) => this.fromMissionResultEntity(mr));
  }
}
