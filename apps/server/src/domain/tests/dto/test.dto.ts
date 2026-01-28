import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

import { MissionDto } from '#domain/missions/dto/mission.dto';

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
