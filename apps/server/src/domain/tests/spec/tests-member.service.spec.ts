import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { Test as TestEntity } from '../entities/test.entity';
import { TestsMemberService } from '../services/tests-member.service';
import { TestsRepository } from '../tests.repository';

import { User } from '#domain/users/entities/user.entity';
import { UsersService } from '#domain/users/users.service';

describe('TestsMemberService', () => {
  let service: TestsMemberService;

  const mockTestsRepository = {
    findByPublicIdWithMembers: jest.fn(),
    save: jest.fn(),
    findDemoTest: jest.fn(),
    addMemberToTests: jest.fn(),
  };

  const mockUsersService = {
    getIdByPublicId: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsMemberService,
        { provide: TestsRepository, useValue: mockTestsRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<TestsMemberService>(TestsMemberService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('addMember', () => {
    it('테스트에 멤버를 추가해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockUsersService.getIdByPublicId.mockResolvedValue(2);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      await service.addMember(1, 'test-123', 'member-123');

      expect(mockTestsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
      expect(mockUsersService.getIdByPublicId).toHaveBeenCalledWith('member-123');
      expect(mockTestsRepository.save).toHaveBeenCalled();
    });

    it('멤버를 추가할 때 새로운 멤버를 생성해야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockUsersService.getIdByPublicId.mockResolvedValue(2);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      await service.addMember(1, 'test-123', 'member-123');

      expect(mockTestsRepository.save).toHaveBeenCalledWith(expect.any(TestEntity));
    });

    it('이미 멤버인 사용자를 추가하면 예외를 던져야 한다', async () => {
      const existingMember = new User();
      existingMember.id = 2;

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [existingMember];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockUsersService.getIdByPublicId.mockResolvedValue(2);

      await expect(service.addMember(1, 'test-123', 'member-123')).rejects.toThrow();
    });
  });

  describe('removeMember', () => {
    it('테스트에서 멤버를 제거해야 한다', async () => {
      const mockMember = new User();
      mockMember.id = 2;
      mockMember.publicId = 'member-123';

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [mockMember];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      await service.removeMember(1, 'test-123', 'member-123');

      expect(mockTestsRepository.findByPublicIdWithMembers).toHaveBeenCalledWith('test-123');
      expect(mockTestsRepository.save).toHaveBeenCalled();
    });

    it('존재하지 않는 멤버를 제거하려고 할 때 예외를 던져야 한다', async () => {
      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);

      await expect(service.removeMember(1, 'test-123', 'invalid-member')).rejects.toThrow();
    });

    it('멤버를 제거하면 배열에서 제거되어야 한다', async () => {
      const mockMember = new User();
      mockMember.id = 2;
      mockMember.publicId = 'member-123';

      const mockTest = TestEntity.createTest('Test', 1);
      mockTest.publicId = 'test-123';
      mockTest.members = [mockMember];

      mockTestsRepository.findByPublicIdWithMembers.mockResolvedValue(mockTest);
      mockTestsRepository.save.mockResolvedValue(mockTest);

      await service.removeMember(1, 'test-123', 'member-123');

      expect(mockTestsRepository.save).toHaveBeenCalled();
    });
  });

  describe('handleUserRegisteredEvent', () => {
    it('사용자 등록 이벤트를 처리해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockDemoTest = TestEntity.createTest('Demo Test', 1);
      mockDemoTest.id = 1;

      mockTestsRepository.findDemoTest.mockResolvedValue(mockDemoTest);
      mockTestsRepository.addMemberToTests.mockResolvedValue(undefined);

      await expect(service.handleUserRegisteredEvent(mockUser)).resolves.not.toThrow();
    });

    it('데모 테스트가 없으면 아무 작업도 하지 않아야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      mockTestsRepository.findDemoTest.mockResolvedValue(null);

      await service.handleUserRegisteredEvent(mockUser);

      expect(mockTestsRepository.addMemberToTests).not.toHaveBeenCalled();
    });

    it('데모 테스트에 사용자를 추가해야 한다', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockDemoTest = TestEntity.createTest('Demo Test', 1);
      mockDemoTest.id = 1;

      mockTestsRepository.findDemoTest.mockResolvedValue(mockDemoTest);
      mockTestsRepository.addMemberToTests.mockResolvedValue(undefined);

      await service.handleUserRegisteredEvent(mockUser);

      expect(mockTestsRepository.addMemberToTests).toHaveBeenCalledWith(1, 1);
    });
  });
});
