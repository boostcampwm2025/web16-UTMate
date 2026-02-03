import { Readable } from 'stream';

import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';

import { SdkService } from '../sdk.service';

import { SDK_AUTH_REDIS } from '#common/redis/redis.module';
import { StorageService } from '#common/storage/storage.service';
import { TestsCommandService } from '#domain/tests/services/tests-command.service';

describe('SdkService', () => {
  let service: SdkService;
  let storageService: StorageService;
  let testsCommandService: TestsCommandService;
  let sdkAuthRedis: Redis;

  const mockStorageService = {
    save: jest.fn(),
  };

  const mockTestsCommandService = {
    verifySdkInstallationBySDK: jest.fn(),
  };

  const mockSdkAuthRedis = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: TestsCommandService, useValue: mockTestsCommandService },
        { provide: SDK_AUTH_REDIS, useValue: mockSdkAuthRedis },
      ],
    }).compile();

    service = module.get<SdkService>(SdkService);
    storageService = module.get<StorageService>(StorageService);
    testsCommandService = module.get<TestsCommandService>(TestsCommandService);
    sdkAuthRedis = module.get(SDK_AUTH_REDIS);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveReplayLog', () => {
    it('Bearer 토큰이 없으면 UnauthorizedException을 던져야 한다', async () => {
      const mockStream = new Readable();

      await expect(service.saveReplayLog('InvalidToken', mockStream)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.saveReplayLog('InvalidToken', mockStream)).rejects.toThrow(
        '유효하지 않은 SDK 인증 정보입니다.',
      );
    });

    it('Redis에 인증 정보가 없으면 UnauthorizedException을 던져야 한다', async () => {
      const mockStream = new Readable();

      mockSdkAuthRedis.get.mockResolvedValue(null);

      await expect(service.saveReplayLog('Bearer invalid-token', mockStream)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.saveReplayLog('Bearer invalid-token', mockStream)).rejects.toThrow(
        '유효하지 않은 SDK 인증 정보입니다.',
      );
    });

    it('정상적으로 리플레이 로그를 저장해야 한다', async () => {
      const missionResultPublicId = 'mission-result-123';
      const mockStream = {
        pipe: jest.fn().mockReturnValue({} as Readable),
      } as unknown as Readable;

      mockSdkAuthRedis.get.mockResolvedValue('valid-auth-data');
      mockStorageService.save.mockResolvedValue(undefined);

      await service.saveReplayLog(`Bearer ${missionResultPublicId}`, mockStream);

      expect(sdkAuthRedis.get).toHaveBeenCalledWith(missionResultPublicId);
      expect(mockStream.pipe).toHaveBeenCalled();
      expect(storageService.save).toHaveBeenCalledWith(
        `replay_logs/${missionResultPublicId}.log.jsonl`,
        expect.anything(),
      );
    });

    it('스트림을 gunzip으로 압축 해제해야 한다', async () => {
      const missionResultPublicId = 'mission-result-456';
      const mockStream = {
        pipe: jest.fn().mockReturnValue({} as Readable),
      } as unknown as Readable;

      mockSdkAuthRedis.get.mockResolvedValue('valid-auth-data');
      mockStorageService.save.mockResolvedValue(undefined);

      await service.saveReplayLog(`Bearer ${missionResultPublicId}`, mockStream);

      // pipe가 호출되었는지 확인 (gunzip 체인)
      expect(mockStream.pipe).toHaveBeenCalled();
    });
  });

  describe('verifySdkInstallation', () => {
    it('TestsService의 verifySdkInstallationBySDK를 호출해야 한다', async () => {
      const testPublicId = 'test-123';

      mockTestsCommandService.verifySdkInstallationBySDK.mockResolvedValue(undefined);

      await service.verifySdkInstallation(testPublicId);

      expect(testsCommandService.verifySdkInstallationBySDK).toHaveBeenCalledWith(testPublicId);
    });

    it('TestsService에서 예외가 발생하면 전파해야 한다', async () => {
      const testPublicId = 'invalid-test';

      mockTestsCommandService.verifySdkInstallationBySDK.mockRejectedValue(
        new Error('Test not found'),
      );

      await expect(service.verifySdkInstallation(testPublicId)).rejects.toThrow('Test not found');
    });
  });
});
