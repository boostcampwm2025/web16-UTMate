import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MissionResult } from './entities/mission-result.entity';

@Injectable()
export class MissionResultsRepository {
  constructor(
    @InjectRepository(MissionResult) private readonly repository: Repository<MissionResult>,
  ) {}

  async save(missionResult: MissionResult): Promise<MissionResult> {
    return this.repository.save(missionResult);
  }

  async findByPublicId(publicId: string) {
    return this.repository
      .createQueryBuilder('missionResult')
      .where('missionResult.publicId = :publicId', { publicId })
      .getOne();
  }
}
