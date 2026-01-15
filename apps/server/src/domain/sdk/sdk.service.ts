import { Readable } from 'stream';
import * as zlib from 'zlib';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { StorageService } from '#common/storage/storage.service';
import { TestsService } from '#domain/tests/tests.service';

@Injectable()
export class SdkService {
  constructor(
    private readonly storageService: StorageService,
    private readonly testsService: TestsService,
  ) {}

  async saveReplayLog(sessionId: string, missionId: string, stream: Readable) {
    if (!sessionId || !missionId) {
      throw new UnauthorizedException('세션 또는 미션 정보가 없습니다.');
    }

    // Gzip 압축 해제 스트림 생성
    const gunzip = zlib.createGunzip();
    const decompressedStream = stream.pipe(gunzip);

    const filename = `replay_log/missions/${missionId}/${sessionId}.log.jsonl`;

    // 스트림을 그대로 StorageService에 전달
    await this.storageService.save(filename, decompressedStream);
  }

  async verifySdkInstallation(testId: string) {
    await this.testsService.verifySdkInstallationBySDK(testId);
  }
}
