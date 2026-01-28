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
    return dto;
  }
}
