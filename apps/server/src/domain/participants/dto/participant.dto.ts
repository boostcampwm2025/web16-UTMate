import { IsEnum, IsObject, IsString } from 'class-validator';

import { Participant } from '../entities/participant.entity';
import { ParticipantStatus } from '../enums';

import { MissionResultDto } from '#domain/mission-result/dto/mission-result.dto';

export class ParticipantDto {
  @IsString()
  id: string;

  @IsEnum(ParticipantStatus)
  status: ParticipantStatus;

  @IsObject()
  missionResults: MissionResultDto[];

  constructor() {}

  static fromEntity(participant: Participant, missionResults: MissionResultDto[]) {
    const dto = new ParticipantDto();
    dto.id = participant.publicId;
    dto.status = participant.status;
    dto.missionResults = missionResults;
    return dto;
  }
}
