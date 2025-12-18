import { Readable } from 'stream';
import { gzipSync } from 'zlib';

import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StorageService } from '#common/storage/storage.service';
import { SdkService } from '#domain/sdk/sdk.service';

describe('SdkService', () => {
  let service: SdkService;
  let storageService: StorageService;

  const mockStorageService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<SdkService>(SdkService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveReplayLog', () => {
    it('로그를 정상적으로 저장해야 한다', async () => {
      const sessionId = 'session-123';
      const missionId = 'mission-456';
      const content = 'test-content';
      // Gzip 압축된 데이터 스트림 생성
      const compressed = gzipSync(content);
      const stream = Readable.from(compressed);

      mockStorageService.save.mockResolvedValue('saved-path');

      await service.saveReplayLog(sessionId, missionId, stream);

      expect(storageService.save).toHaveBeenCalledWith(
        `replay_log/${sessionId}/${missionId}/log.ndjson`,
        expect.any(Object), // Stream object
      );
    });

    it('세션 ID가 없으면 UnauthorizedException을 던져야 한다', async () => {
      const stream = Readable.from(['test']);
      await expect(service.saveReplayLog('', 'mission-123', stream)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('미션 ID가 없으면 UnauthorizedException을 던져야 한다', async () => {
      const stream = Readable.from(['test']);
      await expect(service.saveReplayLog('session-123', '', stream)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
