import { IsEnum, IsIn, IsString } from 'class-validator';

import { MissionResultStatus } from '../entities/mission-result.entity';

export class UpdateMissionResultDto {
  @IsIn([MissionResultStatus.SUCCESS, MissionResultStatus.FAILED])
  @IsEnum(MissionResultStatus)
  status: MissionResultStatus;

  @IsString()
  feedback?: string;
}
