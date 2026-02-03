import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UAParser } from 'ua-parser-js';

import { Participant } from '../../participants/entities/participant.entity';
import { ParticipantsService } from '../../participants/participants.service';
import { User } from '../../users/entities/user.entity';
import { SearchTestQueryDto } from '../dto/search-test.dto';
import { Test as TestEntity, TestStatus } from '../entities/test.entity';
import { TestsRepository } from '../tests.repository';
import { TestsService } from '../tests.service';

import { AgeRange, Gender, Interest } from '#common/enums';
import { MissionsService } from '#domain/missions/missions.service';
import { UsersService } from '#domain/users/users.service';

describe('TestsService', () => {
  let service: TestsService;
  let testsRepository: TestsRepository;
  let usersService: UsersService;

  const mockTestsRepository = {
    save: jest.fn(),
    findByPublicIdAndUserId: jest.fn(),
    findByPublicIdWithMembers: jest.fn(),
    findByPublicIdWithMissions: jest.fn(),
    findByPublicIdAndUserIdWithMissions: jest.fn(),
    findByPublicIdWithRelations: jest.fn(),
    findForParticipantReport: jest.fn(),
    findByPublicIdAndUserIdWithParticipants: jest.fn(),
    findByPublicIdAndUserIdWithRelations: jest.fn(),
    findByPublicIdAndUserIdWithMissionsAndResults: jest.fn(),
    findSdkStatusByPublicIdAndUserId: jest.fn(),
    findByUserIdWithUsers: jest.fn(),
    searchTestsByQuery: jest.fn(),
    remove: jest.fn(),
    updateSdkStatus: jest.fn(),
  };

  const mockMissionsService = {
    updateMissions: jest.fn(),
  };

  const mockParticipantsService = {
    createParticipant: jest.fn(),
  };

  const mockUsersService = {
    getIdByPublicId: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        { provide: TestsRepository, useValue: mockTestsRepository },
        { provide: MissionsService, useValue: mockMissionsService },
        { provide: ParticipantsService, useValue: mockParticipantsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DataSource, useValue: mockDataSource },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TestsService>(TestsService);
    testsRepository = module.get<TestsRepository>(TestsRepository);
    usersService = module.get<UsersService>(UsersService);

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
      expect(testsRepository.save).toHaveBeenCalled();
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
        await callback({});
      });

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);

      const updateDto = {
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
        await callback({});
      });

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(null);

      const updateDto = {
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

  describe('searchTestsByQuery', () => {
    it('검색 쿼리에 따라 테스트들을 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.participants = [];
      mockTest.targetGenders = [Gender.MALE];
      mockTest.targetAges = [AgeRange.TWENTIES];
      mockTest.targetInterests = [Interest.IT];
      mockTest.owner = new User();

      mockTestsRepository.searchTestsByQuery.mockResolvedValue([[mockTest], 10]);

      const query = new SearchTestQueryDto();
      query.page = 1;
      query.limit = 10;

      const result = await service.searchTestsByQuery(query);

      expect(testsRepository.searchTestsByQuery).toHaveBeenCalledWith(query);
      expect(result.totalPage).toBe(1);
    });
  });

  describe('getMyTests', () => {
    it('사용자의 테스트 목록을 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.publicId = 'user-123';
      mockUser.username = 'testuser';
      mockUser.avatarUrl = 'https://avatar.url';

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.owner = mockUser;
      mockTest.members = [mockUser];

      mockTestsRepository.findByUserIdWithUsers.mockResolvedValue([mockTest]);

      await service.getMyTests(1);

      expect(testsRepository.findByUserIdWithUsers).toHaveBeenCalledWith(1);
    });
  });

  describe('getTestById', () => {
    it('공개된 테스트를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.PUBLISHED;
      mockTest.missions = [];
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await service.getTestById(1, 'test-123');

      expect(testsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
    });

    it('비공개 테스트는 소유자만 조회할 수 있어야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.DRAFT;
      mockTest.ownerId = 1;
      mockTest.missions = [];
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await service.getTestById(1, 'test-123');

      expect(testsRepository.findByPublicIdWithMembers).toHaveBeenCalled();
    });

    it('테스트가 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(null);

      await expect(service.getTestById(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('비공개 테스트에 권한이 없으면 NotFoundException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 999);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.DRAFT;
      mockTest.ownerId = 999;
      mockTest.missions = [];
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.getTestById(1, 'test-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSdkStatus', () => {
    it('SDK 설치 상태를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.sdkStatus = true;

      mockTestsRepository.findSdkStatusByPublicIdAndUserId.mockResolvedValue(mockTest);

      const result = await service.getSdkStatus(1, 'test-123');

      expect(result.sdkStatus).toBe(true);
      expect(testsRepository.findSdkStatusByPublicIdAndUserId).toHaveBeenCalledWith('test-123', 1);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findSdkStatusByPublicIdAndUserId.mockResolvedValue(null);

      await expect(service.getSdkStatus(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTest', () => {
    it('테스트를 삭제해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);

      await service.deleteTest(1, 'test-123');

      expect(testsRepository.findByPublicIdAndUserId).toHaveBeenCalledWith('test-123', 1);
      expect(testsRepository.remove).toHaveBeenCalledWith(mockTest);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(null);

      await expect(service.deleteTest(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTestStatus', () => {
    it('테스트 상태를 업데이트해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.transitionStatus = jest.fn();

      mockTestsRepository.findByPublicIdAndUserIdWithMissions.mockResolvedValue(mockTest);

      await service.updateTestStatus(1, 'test-123', TestStatus.PUBLISHED);

      expect(mockTest.transitionStatus).toHaveBeenCalledWith(TestStatus.PUBLISHED);
      expect(testsRepository.save).toHaveBeenCalled();
    });

    it('잘못된 상태 전환 시 BadRequestException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.transitionStatus = jest.fn(() => {
        throw new Error('Invalid status transition');
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
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.url = 'https://example.com';
      mockTest.sdkStatus = false;

      mockTestsRepository.findByPublicIdAndUserId.mockResolvedValue(mockTest);
      mockConfigService.get.mockReturnValue('sdk-domain');

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('<script src="https://sdk-domain/sdk.js"></script>'),
      });

      const result = await service.verifySdkInstallation(1, 'test-123');

      expect(result.sdkStatus).toBe(true);
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

      expect(testsRepository.updateSdkStatus).toHaveBeenCalledWith('test-123', true);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.updateSdkStatus.mockResolvedValue(0);

      await expect(service.verifySdkInstallationBySDK('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('participateTest', () => {
    it('테스트에 참여할 수 있어야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.id = 1;
      mockTest.status = TestStatus.PUBLISHED;
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(mockTest);
      mockParticipantsService.createParticipant.mockResolvedValue({
        participantId: 'participant-123',
        missions: [],
      });

      const uaInfo = {
        ua: 'Mozilla/5.0',
        browser: { name: 'Chrome', version: '90.0.0' },
      } as UAParser.IResult;

      await service.participateTest(1, 'test-123', uaInfo);

      expect(testsRepository.findByPublicIdWithMissions).toHaveBeenCalledWith('test-123');
    });

    it('게시되지 않은 테스트에는 참여할 수 없어야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.id = 1;
      mockTest.status = TestStatus.DRAFT;

      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(mockTest);

      const uaInfo = {} as UAParser.IResult;

      await expect(service.participateTest(1, 'test-123', uaInfo)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdWithMissions.mockResolvedValue(null);

      const uaInfo = {} as UAParser.IResult;

      await expect(service.participateTest(1, 'invalid-id', uaInfo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTestResultSummary', () => {
    it('테스트 결과 요약 정보를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];

      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(mockTest);

      await service.getTestResultSummary(1, 'test-123');

      expect(testsRepository.findByPublicIdAndUserIdWithParticipants).toHaveBeenCalledWith(
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
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdAndUserIdWithRelations.mockResolvedValue(mockTest);

      await service.getTestParticipantsResults(1, 'test-123');

      expect(testsRepository.findByPublicIdAndUserIdWithRelations).toHaveBeenCalledWith(
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
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];

      mockTestsRepository.findByPublicIdAndUserIdWithParticipants.mockResolvedValue(mockTest);

      await service.getTestMainFeedback(1, 'test-123');

      expect(testsRepository.findByPublicIdAndUserIdWithParticipants).toHaveBeenCalledWith(
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
      const mockParticipant = Participant.create(undefined, 1, {} as UAParser.IResult);
      mockParticipant.publicId = 'participant-123';
      mockParticipant.missionResults = [];

      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [mockParticipant];
      mockTest.missions = [];

      mockTestsRepository.findForParticipantReport.mockResolvedValue(mockTest);

      await service.getTestParticipantDetail(1, 'test-123', 'participant-123');

      expect(testsRepository.findForParticipantReport).toHaveBeenCalledWith(
        'test-123',
        'participant-123',
        1,
      );
    });

    it('참여자를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.participants = [];
      mockTest.missions = [];

      mockTestsRepository.findForParticipantReport.mockResolvedValue(mockTest);

      await expect(
        service.getTestParticipantDetail(1, 'test-123', 'invalid-participant'),
      ).rejects.toThrow(NotFoundException);
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findForParticipantReport.mockResolvedValue(null);

      await expect(
        service.getTestParticipantDetail(1, 'invalid-id', 'participant-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMember', () => {
    it('테스트 멤버를 추가해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 1;
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockUsersService.getIdByPublicId.mockResolvedValue(2);

      await service.addMember(1, 'test-123', 'member-123');

      expect(testsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
      expect(usersService.getIdByPublicId).toHaveBeenCalledWith('member-123');
      expect(testsRepository.save).toHaveBeenCalled();
    });

    it('소유자가 아니면 멤버를 추가할 수 없어야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 999);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 999;

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.addMember(1, 'test-123', 'member-123')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('이미 멤버인 사용자를 추가하면 BadRequestException을 던져야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 2;

      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 1;
      mockTest.members = [mockUser];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockUsersService.getIdByPublicId.mockResolvedValue(2);

      await expect(service.addMember(1, 'test-123', 'member-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(null);

      await expect(service.addMember(1, 'invalid-id', 'member-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeMember', () => {
    it('테스트 멤버를 제거해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 2;
      mockUser.publicId = 'member-123';

      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 1;
      mockTest.members = [mockUser];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await service.removeMember(1, 'test-123', 'member-123');

      expect(testsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
      expect(testsRepository.save).toHaveBeenCalled();
      expect(mockTest.members.length).toBe(0);
    });

    it('소유자가 아니면 멤버를 제거할 수 없어야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 999);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 999;

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.removeMember(1, 'test-123', 'member-123')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('멤버를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.ownerId = 1;
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.removeMember(1, 'test-123', 'invalid-member')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(null);

      await expect(service.removeMember(1, 'invalid-id', 'member-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTestMissionsResults', () => {
    it('테스트의 모든 미션과 결과를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('테스트', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdAndUserIdWithMissionsAndResults.mockResolvedValue(mockTest);

      await service.getTestMissionsResults(1, 'test-123');

      expect(testsRepository.findByPublicIdAndUserIdWithMissionsAndResults).toHaveBeenCalledWith(
        'test-123',
        1,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdAndUserIdWithMissionsAndResults.mockResolvedValue(null);

      await expect(service.getTestMissionsResults(1, 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
