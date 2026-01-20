import { IsEnum, IsIn, IsString } from 'class-validator';

import { MissionResultStatus } from '../enums';

export class UpdateMissionResultDto {
  @IsIn([MissionResultStatus.IN_PROGRESS, MissionResultStatus.SUCCESS, MissionResultStatus.FAILED])
  @IsEnum(MissionResultStatus)
  status: MissionResultStatus;

  @IsString()
  feedback?: string;
}
