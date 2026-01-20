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

  /**
   * 세션리플레이 로그를 압축 해제하고 파일로 저장합니다.
   *
   * @param participantId 참여 아이디
   * @param missionId 미션 아이디
   * @param stream 압축된 로그 스트림
   * @throws UnauthorizedException 세션 또는 미션 정보가 없는 경우
   */
  async saveReplayLog(participantId: string, missionId: string, stream: Readable) {
    console.log('saveReplayLog called:', { participantId, missionId });
    if (!participantId || !missionId) {
      console.log('Missing ids - participantId:', participantId, 'missionId:', missionId);
      throw new UnauthorizedException('세션 또는 미션 정보가 없습니다.');
    }

    // Gzip 압축 해제 스트림 생성
    const gunzip = zlib.createGunzip();
    const decompressedStream = stream.pipe(gunzip);

    const filename = `replay_log/missions/${missionId}/${participantId}.log.jsonl`;

    // 스트림을 그대로 StorageService에 전달
    await this.storageService.save(filename, decompressedStream);
  }

  /**
   * SDK 설치를 검증합니다.
   *
   * @param testId 테스트 아이디
   * @throws NotFoundException 테스트를 찾을 수 없는 경우 ( 허위 서비스에서 전파 )
   */
  async verifySdkInstallation(testId: string) {
    await this.testsService.verifySdkInstallationBySDK(testId);
  }
}
