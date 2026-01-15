import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { UpdateMissionResultDto } from './dtos/update-mission-result.dto';
import { MissionResultsService } from './misson-results.service';

@Controller('/mission-results')
export class MissionResultsController {
  constructor(private readonly missionResultsService: MissionResultsService) {}

  @Get('/:id')
  async getMissionResult(@Param('id') _publicId: string) {
    // todo 대시 보드용 미션 결과 상세 조회
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
