import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Mission } from '#domain/missions/entities/mission.entity';

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

  @IsNumber()
  estimatedDuration: number;

  toMissionEntity(testId: number): Mission {
    const mission = new Mission();
    mission.order = this.order;
    mission.name = this.name;
    mission.description = this.description;
    mission.missionUrl = this.url;
    mission.estimatedDuration = this.estimatedDuration;
    mission.testId = testId;
    return mission;
  }
}
