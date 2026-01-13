import { Controller, Headers, Param, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { SdkService } from './sdk.service';

import { Cookies } from '#common/decorators/cookies.decorator';

@Controller('/sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('/replay_logs')
  async uploadReplayLogs(
    @Headers('x-session-id') headerSessionId: string,
    @Headers('x-mission-id') headerMissionId: string,
    @Cookies('session_id') cookieSessionId: string,
    @Cookies('mission_id') cookieMissionId: string,
    @Req() req: Request,
  ) {
    // 헤더 우선, 없으면 쿠키 사용
    const sessionId = headerSessionId || cookieSessionId;
    const missionId = headerMissionId || cookieMissionId;
    return this.sdkService.saveReplayLog(sessionId, missionId, req);
  }

  @Patch('/tests/:testId/verify-sdk')
  async verifySdkInstallation(@Param('testId') testId: string) {
    await this.sdkService.verifySdkInstallation(testId);
  }
}
