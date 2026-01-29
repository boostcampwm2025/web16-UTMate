import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

import { AgeRange, Gender, Interest } from '#common/enums';
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

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @IsEnum(Gender, { each: true })
  targetGenders: Gender[];

  @IsArray()
  @IsEnum(AgeRange, { each: true })
  targetAges: AgeRange[];

  @IsArray()
  @IsEnum(Interest, { each: true })
  targetInterests: Interest[];

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

    // 타겟 페르소나 설정
    dto.isPublic = test.isPublic;
    dto.targetGenders = test.targetGenders;
    dto.targetAges = test.targetAges;
    dto.targetInterests = test.targetInterests;
    return dto;
  }
}
