import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserSummaryDto } from '../dto/user-summary.dto';
import { OAuthProvider, User } from '../entities/user.entity';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

describe('UserService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUserRepository = {
    findByOAuth: jest.fn(),
    save: jest.fn(),
    findSummary: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('registerOrUpdateUser', () => {
    const createMockOAuthUserDto = (): OAuthUserDto => {
      const dto = Object.create(OAuthUserDto.prototype);
      dto.provider = OAuthProvider.github;
      dto.providerId = 'github-123';
      dto.username = 'testuser';
      dto.email = 'test@example.com';
      dto.avatarUrl = 'https://avatar.url';
      return dto;
    };

    it('신규 사용자를 등록해야 한다', async () => {
      const oauthUserDto = createMockOAuthUserDto();
      mockUserRepository.findByOAuth.mockResolvedValue(null);

      // save 호출 시 user 객체에 publicId가 생성되도록 설정
      mockUserRepository.save.mockImplementation(async (user: User) => {
        user.publicId = 'test-public-id';
        return user;
      });

      const result = await service.registerOrUpdateUser(oauthUserDto);

      expect(repository.findByOAuth).toHaveBeenCalledWith('github-123', OAuthProvider.github);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toBe('test-public-id');
    });

    it('기존 사용자 정보를 업데이트해야 한다', async () => {
      const oauthUserDto = createMockOAuthUserDto();
      const existingUser = new User();
      existingUser.publicId = 'existing-id';
      existingUser.provider = OAuthProvider.github;
      existingUser.providerId = 'github-123';
      existingUser.username = 'oldusername';
      existingUser.email = 'old@example.com';
      existingUser.avatarUrl = 'https://old.avatar.url';

      mockUserRepository.findByOAuth.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(existingUser);

      const result = await service.registerOrUpdateUser(oauthUserDto);

      expect(repository.findByOAuth).toHaveBeenCalledWith('github-123', OAuthProvider.github);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          publicId: 'existing-id',
          username: 'testuser',
          email: 'test@example.com',
          avatarUrl: 'https://avatar.url',
        }),
      );
      expect(result).toBe('existing-id');
    });
  });

  describe('getUserSummaryById', () => {
    it('사용자가 존재하면 요약 정보를 반환해야 한다', async () => {
      const mockUser = new User();
      mockUser.publicId = 'user-123';
      mockUser.username = 'testuser';
      mockUser.avatarUrl = 'https://avatar.url';

      mockUserRepository.findSummary.mockResolvedValue(mockUser);

      const result = await service.getUserSummary(1);

      expect(repository.findSummary).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(UserSummaryDto);
      expect(result.publicId).toBe('user-123');
      expect(result.username).toBe('testuser');
      expect(result.avatarUrl).toBe('https://avatar.url');
    });

    it('사용자가 존재하지 않으면 BadRequestException을 던져야 한다', async () => {
      mockUserRepository.findSummary.mockResolvedValue(null);

      await expect(service.getUserSummary(999)).rejects.toThrow(BadRequestException);
      await expect(service.getUserSummary(999)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('레포지토리의 delete를 호출해야 한다', async () => {
      await service.deleteUser(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
