import { MissionResult } from '#domain/mission-result/entities/mission-result.entity';
import { MissionResultStatus } from '#domain/mission-result/enums';

export class MissionProgressDto {
  finishedMissionCount: number = 0;
  isPendingMissionExist: boolean = false;
  pendingMissionId?: number;

  constructor() {}

  static fromMissionResults(missionResults: MissionResult[]) {
    const dto = new MissionProgressDto();
    dto.finishedMissionCount = missionResults.filter(
      (result) =>
        result.status === MissionResultStatus.SUCCESS ||
        result.status === MissionResultStatus.FAILED,
    ).length;
    missionResults.forEach((result) => {
      if (result.status === MissionResultStatus.PENDING) {
        dto.isPendingMissionExist = true;
        dto.pendingMissionId = result.missionId;
      }
    });
    return dto;
  }
}
