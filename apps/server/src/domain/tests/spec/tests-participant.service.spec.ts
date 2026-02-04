import { Test, TestingModule } from '@nestjs/testing';

import { Test as TestEntity } from '../entities/test.entity';
import { TestStatus } from '../enums';
import { TestsParticipantService } from '../services/tests-participant.service';
import { TestsRepository } from '../tests.repository';

import { ParticipantsService } from '#domain/participants/participants.service';

describe('TestsParticipantService', () => {
  let service: TestsParticipantService;

  const mockTestsRepository = {
    findByPublicIdWithMissions: jest.fn(),
  };

  const mockParticipantsService = {
    createParticipant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsParticipantService,
        { provide: TestsRepository, useValue: mockTestsRepository },
        { provide: ParticipantsService, useValue: mockParticipantsService },
      ],
    }).compile();

    service = module.get<TestsParticipantService>(TestsParticipantService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('participateTest', () => {
    it('사용자가 테스트에 참여해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.id = 1;
      mockTest.missions = [];
      mockTest.status = TestStatus.PUBLISHED;

      const mockUaInfo = {} as UAParser.IResult;

      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(mockTest);
      mockParticipantsService.createParticipant.mockResolvedValue({});

      const result = await service.participateTest(1, 'test-123', mockUaInfo);

      expect(result).toBeDefined();
      expect(mockTestsRepository.findByPublicIdWithMissions).toHaveBeenCalledWith('test-123');
      expect(mockParticipantsService.createParticipant).toHaveBeenCalledWith(1, 1, [], mockUaInfo);
    });

    it('게시되지 않은 테스트에는 참여할 수 없어야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.id = 1;
      mockTest.missions = [];
      // status is DRAFT by default

      const mockUaInfo = {} as UAParser.IResult;

      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(mockTest);

      await expect(service.participateTest(1, 'test-123', mockUaInfo)).rejects.toThrow();
    });

    it('존재하지 않는 테스트에는 참여할 수 없어야 한다', async () => {
      const mockUaInfo = {} as UAParser.IResult;

      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(null);

      await expect(service.participateTest(1, 'invalid-id', mockUaInfo)).rejects.toThrow();
    });
  });
});
