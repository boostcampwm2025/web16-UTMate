import { Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { SdkService } from './sdk.service';

import { Cookies } from '#common/decorators/cookies.decorator';

@Controller('/sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('/replay_logs')
  async uploadReplayLogs(
    @Cookies('session_id') sessionId: string,
    @Cookies('mission_id') missionId: string,
    @Req() req: Request,
  ) {
    return this.sdkService.saveReplayLog(sessionId, missionId, req);
  }
}
