import { MissionResultStatus } from '../entities/mission-result.entity';

export class UpdateMissionResultDto {
  status: MissionResultStatus;
  feedback?: string;
}
