import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateMissionResultDto } from './dtos/create-mission-result.dto';
import { MissionResultDto } from './dtos/mission-result.dto';
import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResultService } from './misson-result.service';

@Controller('/mission-results')
export class MissionResultController {
  constructor(private readonly missionResultService: MissionResultService) {}

  @Get()
  async getMissionResults(@Query('mission-id') _missionId: string) {
    // TODO missionId 미션 결과 전체 조회(간단하게) 로직 구현
  }

  @Get('/:missionResultId')
  async getMissionResult(@Param('missionResultId') missionResultId: number) {
    return await this.missionResultService.getMissionResult(missionResultId);
  }

  @Post()
  async createMissionResult(
    @Body() createMissionResultDto: CreateMissionResultDto,
  ): Promise<MissionResultDto> {
    return await this.missionResultService.createMissionResult(createMissionResultDto);
  }

  @Patch('/:missionResultId')
  async completeMissionResult(
    @Param('missionResultId') missionResultId: number,
    @Body() updateMissionResultDto: UpdateMissionResultDto,
  ) {
    return this.missionResultService.updateMissionResult(missionResultId, updateMissionResultDto);
  }
}
