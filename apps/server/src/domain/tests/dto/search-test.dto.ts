import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { Test } from '../entities/test.entity';

import { AgeRange, Gender, Interest } from '#common/enums';

export class SearchTestQueryDto {
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(AgeRange)
  age?: AgeRange;

  @IsOptional()
  @IsArray()
  @IsEnum(Interest, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  interests?: Interest[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 5;
}

export class SearchTestResultDto {
  id: string;
  title: string;
  description: string;
  url: string;

  missionsCount: number;
  totalTimeMinutes: number;
  participantsCount: number;

  tags: string[];

  constructor() {}

  static fromTestEntity(test: Test) {
    const dto = new SearchTestResultDto();
    dto.id = test.publicId;
    dto.title = test.title;
    dto.description = test.description;
    dto.url = test.url;
    dto.missionsCount = test.missions.length;
    dto.totalTimeMinutes = test.missions.reduce(
      (sum, mission) => sum + mission.estimatedDuration,
      0,
    );
    dto.participantsCount = test.participants.length;
    test.targetGenders.forEach((gender) => dto.tags.push(gender));
    test.targetAges.forEach((ageRange) => dto.tags.push(ageRange));
    test.targetInterests.forEach((interest) => dto.tags.push(interest));
    return dto;
  }

  static fromTestEntities(tests: Test[]) {
    return tests.map((test) => this.fromTestEntity(test));
  }
}

export class SearchTestResponseDto {
  tests: SearchTestResultDto[];
  totalPage: number;

  constructor() {}

  static fromTestEntities(tests: Test[], totalPage: number) {
    const dto = new SearchTestResponseDto();
    dto.tests = SearchTestResultDto.fromTestEntities(tests);
    dto.totalPage = totalPage;
    return dto;
  }
}
