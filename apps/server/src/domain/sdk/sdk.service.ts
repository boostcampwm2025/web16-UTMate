import { Readable } from 'stream';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { StorageService } from '#common/storage/storage.service';

@Injectable()
export class SdkService {
  constructor(private readonly storageService: StorageService) {}

  async saveReplayLog(sessionId: string, missionId: string, stream: Readable) {
    if (!sessionId || !missionId) {
      throw new UnauthorizedException('세션 또는 미션 정보가 없습니다.');
    }

    // 스트림을 버퍼로 변환
    const buffer = await this.streamToBuffer(stream);

    const filename = `replay_log/${sessionId}/${missionId}/${Date.now()}.json.gz`;

    await this.storageService.save(filename, buffer);
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
