import { Controller, Headers, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { SdkService } from './sdk.service';

@Controller('/sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('/replay_logs')
  async uploadReplayLogs(@Headers('authorization') authorization: string, @Req() req: Request) {
    return this.sdkService.saveReplayLog(authorization, req);
  }

  @Post('/tests/:testId/verify-sdk')
  async verifySdkInstallation(@Param('testId') testId: string) {
    await this.sdkService.verifySdkInstallation(testId);
  }
}
