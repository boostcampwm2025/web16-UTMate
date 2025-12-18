import { Readable } from 'stream';
import * as zlib from 'zlib';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { StorageService } from '#common/storage/storage.service';

@Injectable()
export class SdkService {
  constructor(private readonly storageService: StorageService) {}

  async saveReplayLog(sessionId: string, missionId: string, stream: Readable) {
    if (!sessionId || !missionId) {
      throw new UnauthorizedException('세션 또는 미션 정보가 없습니다.');
    }

    // Gzip 압축 해제 스트림 생성
    const gunzip = zlib.createGunzip();
    const decompressedStream = stream.pipe(gunzip);

    // 파일명 확장자 변경 (.json.gz -> .ndjson)
    // 타임스탬프 제거하여 하나의 파일에 append 되도록 수정
    const filename = `replay_log/${sessionId}/${missionId}/log.ndjson`;

    // 스트림을 그대로 StorageService에 전달
    await this.storageService.save(filename, decompressedStream);
  }
}
