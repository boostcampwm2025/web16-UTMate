import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

import { ParticipantStatus } from '../enums';

export class CompleteParticipantDto {
  @IsIn([ParticipantStatus.COMPLETED])
  @IsEnum(ParticipantStatus)
  status: ParticipantStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}
