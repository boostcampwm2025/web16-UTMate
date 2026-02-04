import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { MissionResult } from '../entities/mission-result.entity';
import { MissionResultStatus } from '../enums';

import { AnalyzerResult } from '#domain/analyzer/dto/analyzer.dto';

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

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  totalIdleTime?: number;

  @IsOptional()
  @IsNumber()
  rageClickCount?: number;

  @IsOptional()
  @IsNumber()
  mouseThrashingCount?: number;

  @IsOptional()
  analysisData?: AnalyzerResult;

  // 참여자 정보
  @IsString()
  participantId: string;

  @IsOptional()
  personaTags: string[] = [];

  @IsOptional()
  uaInfo: UAParser.IResult;

  constructor() {}

  static fromMissionResultEntity(missionResult: MissionResult, presignedUrl: string) {
    const dto = new MissionResultDetailDto();
    dto.id = missionResult.publicId;
    dto.status = missionResult.status;
    dto.feedback = missionResult.feedback;
    dto.missionId = missionResult.mission.publicId;
    dto.presignedUrl = presignedUrl;
    dto.duration = missionResult.duration;
    dto.totalIdleTime = missionResult.totalIdleTime;
    dto.rageClickCount = missionResult.rageClickCount;
    dto.mouseThrashingCount = missionResult.mouseThrashingCount;
    dto.analysisData = missionResult.analysisData;

    // 참여자 정보 추가
    dto.participantId = missionResult.participant.publicId;
    dto.uaInfo = missionResult.participant.uaInfo;

    if (missionResult.participant.userType === 'REGISTERED' && missionResult.participant.user) {
      if (missionResult.participant.user.persona) {
        dto.personaTags.push(missionResult.participant.user.persona.gender);
        dto.personaTags.push(missionResult.participant.user.persona.ageGroup);
        dto.personaTags.push(...missionResult.participant.user.persona.interests);
      } else {
        dto.personaTags.push('미설정');
      }
    } else {
      dto.personaTags.push('GUEST');
    }

    return dto;
  }
}
