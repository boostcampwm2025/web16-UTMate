import { MissionResult, MissionResultStatus } from '../entities/mission-result.entity';

export class MissionResultDto {
  id: number;
  participantId: string;
  missionId: string;
  status: MissionResultStatus;
  duration: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor() {}

  static fromEntity(missionResult: MissionResult) {
    const dto = new MissionResultDto();
    dto.id = missionResult.id;
    dto.participantId = missionResult.participantId;
    dto.missionId = missionResult.missionId;
    dto.status = missionResult.status;
    dto.duration = missionResult.duration;
    dto.feedback = missionResult.feedback;
    dto.createdAt = missionResult.createdAt;
    dto.updatedAt = missionResult.updatedAt;
    return dto;
  }
}
