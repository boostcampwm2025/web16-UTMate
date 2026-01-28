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
  isPublic: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(Gender, { each: true })
  targetGender: Gender[];

  @IsOptional()
  @IsArray()
  @IsEnum(AgeRange, { each: true })
  targetAgeRange: AgeRange[];

  @IsOptional()
  @IsArray()
  @IsEnum(Interest, { each: true })
  targetInterests: Interest[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMissionDto)
  missions: UpdateMissionDto[];
}
