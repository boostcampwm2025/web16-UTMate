import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { UpdateTestDto } from '../dto/update-test.dto';
import { Test as TestEntity } from '../entities/test.entity';
import { TestStatus } from '../enums';
import { TestsCommandService } from '../services/tests-command.service';
import { TestsRepository } from '../tests.repository';

import { AgeRange, Gender, Interest } from '#common/enums';
import { MissionsService } from '#domain/missions/missions.service';

describe('TestsCommandService', () => {
  let service: TestsCommandService;

  const mockTestsRepository = {
    save: jest.fn(),
    findByPublicIdAndUserId: jest.fn(),
    findByPublicIdAndUserIdWithMissions: jest.fn(),
    remove: jest.fn(),
    updateSdkStatus: jest.fn(),
  };

  const mockMissionsService = {
    updateMissions: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(() => 'utm-sdk'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsCommandService,
        { provide: TestsRepository, useValue: mockTestsRepository },
        { provide: MissionsService, useValue: mockMissionsService },
        { provide: DataSource, useValue: mockDataSource },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TestsCommandService>(TestsCommandService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createTest', () => {
    it('새로운 테스트를 생성해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트 제목', 1);
      mockTest.publicId = 'test-123';
      mockTest.title = '테스트 제목';

      mockTestsRepository.save.mockResolvedValue(mockTest);

      const result = await service.createTest(1, '테스트 제목');

      expect(result).toBe('test-123');
      expect(mockTestsRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateTest', () => {
    it('테스트와 미션 정보를 업데이트해야 한다', async () => {
      const mockTest = TestEntity.createTest('원래 제목', 1);
      mockTest.id = 1;
      mockTest.publicId = 'test-123';
      mockTest.title = '원래 제목';
      mockTest.updateTestInfo = jest.fn();
      mockTest.updateTargeting = jest.fn();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return callback(null);
      });

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);

      const updateDto: UpdateTestDto = {
        title: '새 제목',
        description: '새 설명',
        url: 'https://example.com',
        isPublic: true,
        targetGenders: [Gender.MALE],
        targetAges: [AgeRange.TWENTIES],
        targetInterests: [Interest.IT],
        missions: [],
      };

      await service.updateTest(1, 'test-123', updateDto);

      expect(mockTest.updateTestInfo).toHaveBeenCalled();
      expect(mockTest.updateTargeting).toHaveBeenCalled();
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockDataSource.transaction.mockImplementation(async (callback) => {
        return callback(null);
      });

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(null);

      const updateDto: UpdateTestDto = {
        title: '새 제목',
        description: '새 설명',
        url: 'https://example.com',
        isPublic: true,
        targetGenders: [],
        targetAges: [],
        targetInterests: [],
        missions: [],
      };

      await expect(service.updateTest(1, 'invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTest', () => {
    it('테스트를 삭제해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);
      mockTestsRepository.remove.mockResolvedValue(undefined);

      await service.deleteTest(1, 'test-123');

      expect(mockTestsRepository.remove).toHaveBeenCalledWith(mockTest);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(null);

      await expect(service.deleteTest(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTestStatus', () => {
    it('테스트 상태를 업데이트해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.transitionStatus = jest.fn();

      mockTestsRepository.findByPublicIdAndUserIdWithMissions.mockResolvedValue(mockTest);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      await service.updateTestStatus(1, 'test-123', TestStatus.PUBLISHED);

      expect(mockTest.transitionStatus).toHaveBeenCalledWith(TestStatus.PUBLISHED);
      expect(mockTestsRepository.save).toHaveBeenCalledWith(mockTest);
    });

    it('잘못된 상태 전환 시 BadRequestException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.transitionStatus = jest.fn(() => {
        throw new Error('Invalid transition');
      });

      mockTestsRepository.findByPublicIdAndUserIdWithMissions.mockResolvedValue(mockTest);

      await expect(service.updateTestStatus(1, 'test-123', TestStatus.PUBLISHED)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithMissions.mockResolvedValue(null);

      await expect(service.updateTestStatus(1, 'invalid-id', TestStatus.PUBLISHED)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifySdkInstallation', () => {
    it('SDK 설치를 검증하고 상태를 업데이트해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.url = 'https://example.com';
      mockTest.sdkStatus = false;

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      globalThis.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(
              '<script src="https://utm-sdk.example.com/sdk.js"></script><body></body>',
            ),
        } as Response),
      );

      const result = await service.verifySdkInstallation(1, 'test-123');

      expect(result.sdkStatus).toBe(true);
      expect(mockTestsRepository.save).toHaveBeenCalled();
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(null);

      await expect(service.verifySdkInstallation(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifySdkInstallationBySDK', () => {
    it('SDK를 통해 SDK 설치 상태를 업데이트해야 한다', async () => {
      mockTestsRepository.updateSdkStatus.mockResolvedValue(1);

      await service.verifySdkInstallationBySDK('test-123');

      expect(mockTestsRepository.updateSdkStatus).toHaveBeenCalledWith('test-123', true);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.updateSdkStatus.mockResolvedValue(0);

      await expect(service.verifySdkInstallationBySDK('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
