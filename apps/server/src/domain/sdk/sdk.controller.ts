import { Controller, Headers, Logger, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { SdkService } from './sdk.service';

@Controller('/sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('/replay_logs')
  async uploadReplayLogs(
    @Headers('x-participant-id') participantId: string,
    @Headers('x-mission-id') missionId: string,
    @Req() req: Request,
  ) {
    return this.sdkService.saveReplayLog(participantId, missionId, req);
  }

  @Post('/tests/:testId/verify-sdk')
  async verifySdkInstallation(@Param('testId') testId: string) {
    await this.sdkService.verifySdkInstallation(testId);
  }
}
