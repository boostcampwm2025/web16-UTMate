import { Body, Controller, Inject, Param, Post } from '@nestjs/common';

import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(@Inject() private readonly missionsService: MissionsService) {}

  @Post(':id/missionResult')
  async createMissionResult(@Param('id') publicId: string, @Body() ParticipantId: string) {
    return await this.missionsService.createMissionResult(publicId, ParticipantId);
  }
}
