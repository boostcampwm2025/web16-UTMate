import { IsNumber, IsString } from 'class-validator';

import { Mission } from '../entities/mission.entity';

export class MissionDto {
  @IsString()
  publicId: string;

  @IsNumber()
  order: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  missionUrl: string;

  @IsNumber()
  estimatedDuration: number;

  private constructor() {}

  static fromMissionEntity(mission: Mission) {
    const dto = new MissionDto();
    dto.publicId = mission.publicId;
    dto.order = mission.order;
    dto.name = mission.name;
    dto.description = mission.description;
    dto.missionUrl = mission.missionUrl;
    dto.estimatedDuration = mission.estimatedDuration;
    return dto;
  }

  static fromMissionEntities(missions: Mission[]) {
    return missions.map((mission) => this.fromMissionEntity(mission));
  }
}
