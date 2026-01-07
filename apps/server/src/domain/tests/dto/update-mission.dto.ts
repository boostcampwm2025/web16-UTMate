import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Mission } from '../entities/mission.entity';
import { Test } from '../entities/test.entity';

export class UpdateMissionDto {
  @IsString()
  @IsOptional()
  publicId?: string;

  @IsNumber()
  order: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  toUserEntity(test: Test): Mission {
    return Mission.createMission(this.order, this.name, this.description, this.url, test);
  }
}
