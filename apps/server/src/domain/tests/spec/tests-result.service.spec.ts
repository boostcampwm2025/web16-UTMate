import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Test as TestEntity } from '../entities/test.entity';
import { TestsResultService } from '../services/tests-result.service';
import { TestsRepository } from '../tests.repository';

import { Participant } from '#domain/participants/entities/participant.entity';
import { User } from '#domain/users/entities/user.entity';

describe('TestsResultService', () => {
  let service: TestsResultService;

  const mockTestsRepository = {
    findByPublicIdAndUserIdWithParticipants: jest.fn(),
    findByPublicIdAndUserIdWithRelations: jest.fn(),
    findForParticipantReport: jest.fn(),
    findByPublicIdAndUserIdWithMissionsAndResults: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestsResultService, { provide: TestsRepository, useValue: mockTestsRepository }],
    }).compile();

    service = module.get<TestsResultService>(TestsResultService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('getTestResultSummary', () => {
    it('테스트 결과 요약 정보를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];

      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(mockTest);

      const result = await service.getTestResultSummary(1, 'test-123');

      expect(result).toBeDefined();
      expect(mockTestsRepository.findByPublicIdAndUserIdWithParticipants).toHaveBeenCalledWith(
        'test-123',
        1,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(null);

      await expect(service.getTestResultSummary(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTestParticipantsResults', () => {
    it('테스트 참여자들의 미션 결과를 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockParticipant = Participant.create(1, 1, {} as UAParser.IResult);
      mockParticipant.missionResults = [];

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [mockParticipant];
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdAndUserIdWithRelations.mockResolvedValue(mockTest);

      const result = await service.getTestParticipantsResults(1, 'test-123');

      expect(result).toBeDefined();
      expect(mockTestsRepository.findByPublicIdAndUserIdWithRelations).toHaveBeenCalledWith(
        'test-123',
        1,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithRelations.mockResolvedValue(null);

      await expect(service.getTestParticipantsResults(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTestMainFeedback', () => {
    it('테스트 주요 피드백을 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];

      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(mockTest);

      const result = await service.getTestMainFeedback(1, 'test-123');

      expect(result).toBeDefined();
      expect(mockTestsRepository.findByPublicIdAndUserIdWithParticipants).toHaveBeenCalledWith(
        'test-123',
        1,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(null);

      await expect(service.getTestMainFeedback(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTestParticipantDetail', () => {
    it('특정 참여자의 상세 정보를 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockParticipant = Participant.create(1, 1, {} as UAParser.IResult);
      mockParticipant.missionResults = [];

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [mockParticipant];
      mockTest.missions = [];

      mockTestsRepository.findForParticipantReport.mockResolvedValue(mockTest);

      const result = await service.getTestParticipantDetail(1, 'test-123', 'participant-123');

      expect(result).toBeDefined();
      expect(mockTestsRepository.findForParticipantReport).toHaveBeenCalledWith(
        'test-123',
        'participant-123',
        1,
      );
    });

    it('참여자를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];

      mockTestsRepository.findForParticipantReport.mockResolvedValue(mockTest);

      await expect(
        service.getTestParticipantDetail(1, 'test-123', 'invalid-participant-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findForParticipantReport.mockResolvedValue(null);

      await expect(
        service.getTestParticipantDetail(1, 'invalid-id', 'participant-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTestMissionsResults', () => {
    it('테스트의 모든 미션과 결과를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.participants = [];

      mockTestsRepository.findByPublicIdAndUserIdWithMissionsAndResults.mockResolvedValue(mockTest);

      const result = await service.getTestMissionsResults(1, 'test-123');

      expect(result).toBeDefined();
      expect(
        mockTestsRepository.findByPublicIdAndUserIdWithMissionsAndResults,
      ).toHaveBeenCalledWith('test-123', 1);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithMissionsAndResults.mockResolvedValue(null);

      await expect(service.getTestMissionsResults(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
