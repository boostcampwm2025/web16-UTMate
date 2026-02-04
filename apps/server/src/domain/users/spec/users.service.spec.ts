import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { CreatePersonaDto, UpdatePersonaDto } from '../dto/persona.dto';
import { UserSummaryDto } from '../dto/user-summary.dto';
import { Persona } from '../entities/persona.entity';
import { OAuthProvider, User } from '../entities/user.entity';
import { PersonaRepository } from '../persona.repository';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';

import { AgeRange, Gender, Interest } from '#common/enums';
import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

describe('UserService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let personaRepository: PersonaRepository;

  const mockUserRepository = {
    findByOAuth: jest.fn(),
    save: jest.fn(),
    findSummary: jest.fn(),
    delete: jest.fn(),
    findIdByPublicId: jest.fn(),
    findByUsername: jest.fn(),
  };

  const mockPersonaRepository = {
    findByUserId: jest.fn(),
    save: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
        {
          provide: PersonaRepository,
          useValue: mockPersonaRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    personaRepository = module.get<PersonaRepository>(PersonaRepository);

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

  describe('getIdByPublicId', () => {
    it('publicId로 사용자 id를 조회해야 한다', async () => {
      const mockUser = { id: 1 };
      mockUserRepository.findIdByPublicId.mockResolvedValue(mockUser);

      const result = await service.getIdByPublicId('test-public-id');

      expect(repository.findIdByPublicId).toHaveBeenCalledWith('test-public-id');
      expect(result).toBe(1);
    });

    it('사용자가 존재하지 않으면 BadRequestException을 던져야 한다', async () => {
      mockUserRepository.findIdByPublicId.mockResolvedValue(null);

      await expect(service.getIdByPublicId('invalid-id')).rejects.toThrow(BadRequestException);
      await expect(service.getIdByPublicId('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('getUsersByUsername', () => {
    it('username으로 사용자를 조회해야 한다', async () => {
      const mockUser = new User();
      mockUser.publicId = 'user-123';
      mockUser.username = 'testuser';
      mockUser.avatarUrl = 'https://avatar.url';

      mockUserRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await service.getUsersByUsername({ username: 'testuser' });

      expect(repository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toBeInstanceOf(UserSummaryDto);
      expect(result.username).toBe('testuser');
    });

    it('사용자가 존재하지 않으면 BadRequestException을 던져야 한다', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(service.getUsersByUsername({ username: 'nonexistent' })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getUsersByUsername({ username: 'nonexistent' })).rejects.toThrow(
        '존재하는 사용자가 없습니다.',
      );
    });
  });

  describe('getPersona', () => {
    it('사용자의 페르소나를 조회해야 한다', async () => {
      const mockPersona = new Persona();
      mockPersona.userId = 1;
      mockPersona.gender = Gender.MALE;
      mockPersona.ageGroup = AgeRange.TWENTIES;
      mockPersona.interests = [Interest.IT, Interest.MUSIC];

      mockPersonaRepository.findByUserId.mockResolvedValue(mockPersona);

      const result = await service.getPersona(1);

      expect(personaRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        gender: Gender.MALE,
        ageGroup: AgeRange.TWENTIES,
        interests: [Interest.IT, Interest.MUSIC],
      });
    });

    it('페르소나가 존재하지 않으면 NotFoundException을 던져야 한다', async () => {
      mockPersonaRepository.findByUserId.mockResolvedValue(null);

      await expect(service.getPersona(999)).rejects.toThrow(NotFoundException);
      await expect(service.getPersona(999)).rejects.toThrow('Persona not found.');
    });
  });

  describe('createPersona', () => {
    it('새 페르소나를 생성해야 한다', async () => {
      const createDto = new CreatePersonaDto();
      createDto.gender = Gender.FEMALE;
      createDto.ageGroup = AgeRange.FIFTIES;
      createDto.interests = [Interest.TRAVEL, Interest.AI];

      mockPersonaRepository.findByUserId.mockResolvedValue(null);
      mockPersonaRepository.save.mockImplementation(async (persona: Persona) => persona);

      const result = await service.createPersona(1, createDto);

      expect(personaRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(personaRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          gender: Gender.FEMALE,
          ageGroup: AgeRange.FIFTIES,
          interests: [Interest.TRAVEL, Interest.AI],
        }),
      );
      expect(result).toEqual({
        gender: Gender.FEMALE,
        ageGroup: AgeRange.FIFTIES,
        interests: [Interest.TRAVEL, Interest.AI],
      });
    });

    it('이미 페르소나가 존재하면 BadRequestException을 던져야 한다', async () => {
      const existingPersona = new Persona();
      existingPersona.userId = 1;
      existingPersona.gender = Gender.MALE;

      mockPersonaRepository.findByUserId.mockResolvedValue(existingPersona);

      const createDto = {
        gender: Gender.FEMALE,
        ageGroup: AgeRange.FIFTIES,
        interests: [Interest.TRAVEL, Interest.AI],
      };

      await expect(service.createPersona(1, createDto)).rejects.toThrow(BadRequestException);
      await expect(service.createPersona(1, createDto)).rejects.toThrow(
        'Persona already exists. Use PUT to update.',
      );
    });
  });

  describe('updatePersona', () => {
    it('페르소나를 업데이트해야 한다', async () => {
      const existingPersona = new Persona();
      existingPersona.userId = 1;
      existingPersona.gender = Gender.MALE;
      existingPersona.ageGroup = AgeRange.TWENTIES;
      existingPersona.interests = [Interest.IT];

      const updateDto = new UpdatePersonaDto();
      updateDto.gender = Gender.FEMALE;
      updateDto.ageGroup = AgeRange.THIRTIES;
      updateDto.interests = [Interest.IT, Interest.READING];

      mockPersonaRepository.findByUserId.mockResolvedValue(existingPersona);
      mockPersonaRepository.save.mockImplementation(async (persona: Persona) => persona);

      const result = await service.updatePersona(1, updateDto);

      expect(personaRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(personaRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          gender: Gender.FEMALE,
          ageGroup: AgeRange.THIRTIES,
          interests: [Interest.IT, Interest.READING],
        }),
      );
      expect(result).toEqual({
        gender: Gender.FEMALE,
        ageGroup: AgeRange.THIRTIES,
        interests: [Interest.IT, Interest.READING],
      });
    });

    it('일부 필드만 업데이트해야 한다', async () => {
      const existingPersona = new Persona();
      existingPersona.userId = 1;
      existingPersona.gender = Gender.MALE;
      existingPersona.ageGroup = AgeRange.TWENTIES;
      existingPersona.interests = [Interest.IT];

      const updateDto = new UpdatePersonaDto();
      updateDto.gender = Gender.FEMALE;

      mockPersonaRepository.findByUserId.mockResolvedValue(existingPersona);
      mockPersonaRepository.save.mockImplementation(async (persona: Persona) => persona);

      const result = await service.updatePersona(1, updateDto);

      expect(personaRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          gender: Gender.FEMALE,
          ageGroup: AgeRange.TWENTIES, // 변경되지 않음
          interests: [Interest.IT], // 변경되지 않음
        }),
      );
      expect(result.gender).toBe(Gender.FEMALE);
      expect(result.ageGroup).toBe(AgeRange.TWENTIES);
    });

    it('페르소나가 존재하지 않으면 NotFoundException을 던져야 한다', async () => {
      mockPersonaRepository.findByUserId.mockResolvedValue(null);

      const updateDto = new UpdatePersonaDto();
      updateDto.gender = Gender.FEMALE;

      await expect(service.updatePersona(999, updateDto)).rejects.toThrow(NotFoundException);
      await expect(service.updatePersona(999, updateDto)).rejects.toThrow(
        'Persona not found. Use POST to create.',
      );
    });
  });
});
