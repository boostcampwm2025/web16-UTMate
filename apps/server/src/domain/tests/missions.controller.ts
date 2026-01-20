import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { MissionsService } from './missions.service';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('missions')
export class MissionsController {
  constructor(@Inject() private readonly missionsService: MissionsService) {}

  @Get('/:id/result')
  @UseGuards(JwtAuthGuard)
  async getMissionResultById(@UserId() userId: number, @Param('id') missionId: string) {
    return this.missionsService.getMissionResultById(userId, missionId);
  }
}
