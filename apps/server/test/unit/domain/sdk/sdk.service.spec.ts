import { Readable } from 'stream';

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
      const stream = Readable.from([content]);

      mockStorageService.save.mockResolvedValue('saved-path');

      await service.saveReplayLog(sessionId, missionId, stream);

      expect(storageService.save).toHaveBeenCalledWith(
        expect.stringMatching(/replay_log\/session-123\/mission-456\/\d+\.json\.gz/),
        expect.any(Buffer),
      );
    });
  });
});
