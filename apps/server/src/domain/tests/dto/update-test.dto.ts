import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpdateMissionDto } from '../../missions/dto/update-mission.dto';

export class UpdateTestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMissionDto)
  missions: UpdateMissionDto[];
}
