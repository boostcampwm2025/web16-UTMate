import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { CreateMissionResultDto } from './dtos/create-mission-result.dto';
import { MissionResultDto } from './dtos/mission-result.dto';
import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResultsService } from './misson-results.service';

@Controller('/mission-results')
export class MissionResultsController {
  constructor(private readonly missionResultsService: MissionResultsService) {}

  @Get()
  async getMissionResults(@Query('mission-id') missionId: string) {
    return await this.missionResultsService.getMissionResults(missionId);
  }

  @Get('/:missionResultId')
  async getMissionResult(@Param('missionResultId', ParseIntPipe) missionResultId: number) {
    return await this.missionResultsService.getMissionResult(missionResultId);
  }

  @Post()
  async createMissionResult(
    @Body() createMissionResultDto: CreateMissionResultDto,
  ): Promise<MissionResultDto> {
    return await this.missionResultsService.createMissionResult(createMissionResultDto);
  }

  @Patch('/:missionResultId')
  async completeMissionResult(
    @Param('missionResultId', ParseIntPipe) missionResultId: number,
    @Body() updateMissionResultDto: UpdateMissionResultDto,
  ) {
    return this.missionResultsService.updateMissionResult(missionResultId, updateMissionResultDto);
  }
}
