import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

import { MissionDto } from './mission.dto';

import { MissionProgressDto } from '#domain/participants/dto/mission-progress.dto';

export class TestDto {
  @IsString()
  publicId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsString()
  url: string;

  @IsBoolean()
  sdkStatus: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissionDto)
  missions: MissionDto[];

  constructor() {}

  static fromTestEntity(test: Test) {
    const dto = new TestDto();
    dto.publicId = test.publicId;
    dto.title = test.title;
    dto.description = test.description;
    dto.status = test.status;
    dto.url = test.url;
    dto.sdkStatus = test.sdkStatus;
    dto.missions = MissionDto.fromMissionEntities(test.missions);
    return dto;
  }
}

export class TestWithProgressDto extends TestDto {
  finishedMissionCount: number;
  isPendingMissionExist: boolean;
  pendingMissionId?: string;

  constructor() {
    super();
  }

  static fromTestEntityWithProgress(test: Test, progress: MissionProgressDto) {
    const dto = new TestWithProgressDto();
    Object.assign(dto, TestDto.fromTestEntity(test));
    dto.finishedMissionCount = progress.finishedMissionCount;
    dto.isPendingMissionExist = progress.isPendingMissionExist;
    if (progress.pendingMissionId) {
      dto.pendingMissionId = test.missions.find(
        (mission) => mission.id === progress.pendingMissionId,
      )?.publicId;
    }
    return dto;
  }
}
