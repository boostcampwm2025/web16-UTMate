import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { UpdateMissionResultDto } from './dto/update-mission-result.dto';
import { MissionResultsService } from './misson-results.service';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('/mission-results')
export class MissionResultsController {
  constructor(private readonly missionResultsService: MissionResultsService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getMissionResult(@UserId() userId: number, @Param('id') publicId: string) {
    return this.missionResultsService.getMissionResultsDetail(userId, publicId);
  }

  @Post('/:id/record')
  async createMissionResultRecord(@Param('id') publicId: string) {
    return this.missionResultsService.createMissionResultRecord(publicId);
  }

  @Patch('/:id')
  async completeMissionResult(
    @Param('id') publicId: string,
    @Body() updateMissionResultDto: UpdateMissionResultDto,
  ) {
    return this.missionResultsService.updateMissionResult(publicId, updateMissionResultDto);
  }
}
