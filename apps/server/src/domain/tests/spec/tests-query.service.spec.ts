import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SearchTestQueryDto } from '../dto/search-test.dto';
import { Test as TestEntity } from '../entities/test.entity';
import { TestStatus } from '../enums';
import { TestsQueryService } from '../services/tests-query.service';
import { TestsRepository } from '../tests.repository';

import { AgeRange, Gender, Interest } from '#common/enums';
import { User } from '#domain/users/entities/user.entity';

describe('TestsQueryService', () => {
  let service: TestsQueryService;

  const mockTestsRepository = {
    searchTestsByQuery: jest.fn(),
    findByUserIdWithUsers: jest.fn(),
    findByPublicIdWithMembers: jest.fn(),
    findSdkStatusByPublicIdAndUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestsQueryService, { provide: TestsRepository, useValue: mockTestsRepository }],
    }).compile();

    service = module.get<TestsQueryService>(TestsQueryService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('searchTestsByQuery', () => {
    it('검색 쿼리에 따라 테스트들을 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.publicId = 'user-123';
      mockUser.username = 'testuser';

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.participants = [];
      mockTest.targetGenders = [Gender.MALE];
      mockTest.targetAges = [AgeRange.TWENTIES];
      mockTest.targetInterests = [Interest.IT];
      mockTest.owner = mockUser;

      mockTestsRepository.searchTestsByQuery.mockResolvedValue([[mockTest], 10]);

      const query = new SearchTestQueryDto();
      query.page = 1;
      query.limit = 10;

      const result = await service.searchTestsByQuery(query);

      expect(mockTestsRepository.searchTestsByQuery).toHaveBeenCalledWith(query);
      expect(result.totalPage).toBe(1);
    });
  });

  describe('getMyTests', () => {
    it('사용자의 테스트 목록을 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.publicId = 'user-123';
      mockUser.username = 'testuser';

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.missions = [];
      mockTest.participants = [];
      mockTest.members = [];
      mockTest.targetGenders = [Gender.MALE];
      mockTest.targetAges = [AgeRange.TWENTIES];
      mockTest.targetInterests = [Interest.IT];
      mockTest.owner = mockUser;

      mockTestsRepository.findByUserIdWithUsers.mockResolvedValue([mockTest]);

      const result = await service.getMyTests(1);

      expect(mockTestsRepository.findByUserIdWithUsers).toHaveBeenCalledWith(1);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getTestById', () => {
    it('공개된 테스트를 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.PUBLISHED;
      mockTest.owner = mockUser;
      mockTest.members = [];
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      const result = await service.getTestById(2, 'test-123');

      expect(result).toBeDefined();
      expect(mockTestsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
    });

    it('비공개 테스트는 소유자만 조회할 수 있어야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.DRAFT;
      mockTest.ownerId = 1;
      mockTest.owner = mockUser;
      mockTest.members = [];
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      const result = await service.getTestById(1, 'test-123');

      expect(result).toBeDefined();
    });

    it('테스트가 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(null);

      await expect(service.getTestById(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('비공개 테스트에 권한이 없으면 NotFoundException을 던져야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.status = TestStatus.DRAFT;
      mockTest.ownerId = 1;
      mockTest.owner = mockUser;
      mockTest.members = [];
      mockTest.missions = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.getTestById(2, 'test-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSdkStatus', () => {
    it('SDK 설치 상태를 조회해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.sdkStatus = true;

      mockTestsRepository.findSdkStatusByPublicIdAndUserId.mockResolvedValue(mockTest);

      const result = await service.getSdkStatus(1, 'test-123');

      expect(result.sdkStatus).toBe(true);
      expect(mockTestsRepository.findSdkStatusByPublicIdAndUserId).toHaveBeenCalledWith(
        'test-123',
        1,
      );
    });

    it('테스트를 찾을 수 없으면 NotFoundException을 던져야 한다', async () => {
      mockTestsRepository.findSdkStatusByPublicIdAndUserId.mockResolvedValue(null);

      await expect(service.getSdkStatus(1, 'invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
