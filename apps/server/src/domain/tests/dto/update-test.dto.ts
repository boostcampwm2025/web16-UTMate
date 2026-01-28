import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpdateMissionDto } from '../../missions/dto/update-mission.dto';

import { AgeRange, Gender, Interest } from '#common/enums';

export class UpdateTestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsBoolean()
  isPublic: boolean = false;

  @IsArray()
  @IsEnum(Gender, { each: true })
  targetGender: Gender[] = [];

  @IsArray()
  @IsEnum(AgeRange, { each: true })
  targetAgeRange: AgeRange[] = [];

  @IsArray()
  @IsEnum(Interest, { each: true })
  targetInterests: Interest[] = [];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMissionDto)
  missions: UpdateMissionDto[] = [];
}
