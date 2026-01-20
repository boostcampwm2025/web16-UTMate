import { Controller, Get, Inject, Param } from '@nestjs/common';

import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(@Inject() private readonly missionsService: MissionsService) {}

  @Get('/:id/result')
  async getMissionResultById(@Param('id') missionId: string) {
    return this.missionsService.getMissionResultById(missionId);
  }
}
