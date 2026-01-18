import { Readable } from 'stream';

import { Test, TestingModule } from '@nestjs/testing';

import { SdkService } from '../sdk.service';

import { StorageService } from '#common/storage/storage.service';
import { TestsService } from '#domain/tests/tests.service';

describe('SdkService', () => {
  let service: SdkService;
  let storageService: { save: jest.Mock };
  let testsService: { verifySdkInstallationBySDK: jest.Mock };
  beforeEach(async () => {
    storageService = { save: jest.fn() };
    testsService = { verifySdkInstallationBySDK: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkService,
        { provide: StorageService, useValue: storageService },
        { provide: TestsService, useValue: testsService },
      ],
    }).compile();
    service = module.get<SdkService>(SdkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveReplayLog', () => {
    it('세션 또는 미션 정보가 없으면 UnauthorizedException을 던진다', async () => {
      const mockStream = new Readable();
      await expect(service.saveReplayLog('', 'mission', mockStream)).rejects.toThrow(
        '세션 또는 미션 정보가 없습니다.',
      );
      await expect(service.saveReplayLog('session', '', mockStream)).rejects.toThrow(
        '세션 또는 미션 정보가 없습니다.',
      );
    });

    it('정상적으로 로그를 저장한다', async () => {
      const sessionId = 'session1';
      const missionId = 'mission1';
      // Readable stream mock
      const stream = {
        pipe: jest.fn().mockReturnValue('decompressedStream'),
      } as unknown as Readable;
      storageService.save.mockResolvedValue(undefined);

      await service.saveReplayLog(sessionId, missionId, stream);
      expect(stream.pipe).toHaveBeenCalled();
      expect(storageService.save).toHaveBeenCalledWith(
        `replay_log/missions/${missionId}/${sessionId}.log.jsonl`,
        'decompressedStream',
      );
    });
  });

  describe('verifySdkInstallation', () => {
    it('테스트 서비스의 verifySdkInstallationBySDK를 호출한다', async () => {
      testsService.verifySdkInstallationBySDK.mockResolvedValue(undefined);
      await service.verifySdkInstallation('testId');
      expect(testsService.verifySdkInstallationBySDK).toHaveBeenCalledWith('testId');
    });
  });
});
