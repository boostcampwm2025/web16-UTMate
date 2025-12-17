import { Module } from '@nestjs/common';

import { MissionResultController } from './mission-result.controller';
import { MissionResultRepository } from './mission-result.repository';
import { MissionResultService } from './misson-result.service';

@Module({
  imports: [],
  controllers: [MissionResultController],
  providers: [MissionResultService, MissionResultRepository],
})
export class MissionResultModule {}
