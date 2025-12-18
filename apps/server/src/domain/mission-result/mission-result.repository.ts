import { Injectable } from '@nestjs/common';

import { MissionResult } from './entities/mission-result.entity';

@Injectable()
export class MissionResultRepository {
  private currentId = 1;
  private missionResults: Map<number, MissionResult>;
  constructor() {
    this.missionResults = new Map<number, MissionResult>();
  }

  async save(missionResult: MissionResult): Promise<MissionResult> {
    missionResult.id = this.currentId++;
    this.missionResults.set(missionResult.id, missionResult);
    return missionResult;
  }

  async findById(missionResultId: number): Promise<MissionResult | undefined> {
    return this.missionResults.get(missionResultId);
  }
}
