import { Controller, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { SdkService } from './sdk.service';

@Controller('/sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('/sessions/:sessionId/missions/:missionId/replay_logs')
  async uploadReplayLogs(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Param('missionId', ParseUUIDPipe) missionId: string,
    @Req() req: Request,
  ) {
    return this.sdkService.saveReplayLog(sessionId, missionId, req);
  }
}
