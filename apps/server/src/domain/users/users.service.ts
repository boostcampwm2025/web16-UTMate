import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { SearchUserDto } from './dto/search-user.dto';
import { UserSummaryDto } from './dto/user-summary.dto';
import { CreatePersonaDto, PersonaResponseDto, UpdatePersonaDto } from './dto/persona.dto';
import { UsersRepository } from './users.repository';
import { PersonaRepository } from './persona.repository';
import { Persona } from './entities/persona.entity';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly personaRepository: PersonaRepository,
  ) {}

  /**
   * OAuthUserDto를 기반으로 사용자를 등록하거나 업데이트합니다.
   *
   * @param oauthUser OAuth 인증 후 반환된 사용자 정보
   * @returns 사용자의 publicId (jwt 생성 payload에 사용)
   */
  async registerOrUpdateUser(oauthUser: OAuthUserDto) {
    // 기존 사용자 조회
    const findUser = await this.usersRepository.findByOAuth(
      oauthUser.providerId,
      oauthUser.provider,
    );

    // 사용자가 존재하는 경우 정보 업데이트
    if (findUser) {
      findUser.username = oauthUser.username;
      findUser.email = oauthUser.email;
      findUser.avatarUrl = oauthUser.avatarUrl;

      await this.usersRepository.save(findUser);
      return findUser.publicId;
    }

    // 사용자가 존재하지 않는 경우 새로 등록
    const user = oauthUser.toUserEntity();
    await this.usersRepository.save(user);
    return user.publicId;
  }

  /**
   * 사용자 요약 정보를 반환합니다.
   *
   * @param id 사용자 id
   * @returns 사용자 요약 정보
   */
  async getUserSummary(id: number) {
    const user = await this.usersRepository.findSummary(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return UserSummaryDto.fromUserEntity(user);
  }

  /**
   * 사용자를 삭제합니다.
   *
   * @param id 사용자 id
   */
  async deleteUser(id: number) {
    this.usersRepository.delete(id);
  }

  /**
   * publicId를 기반으로 사용자의 id를 반환합니다.
   * 커버링 인덱스를 사용하여 id만 조회합니다.
   *
   * @param publicId 사용자 publicId
   * @returns 사용자 id
   */
  async getIdByPublicId(publicId: string) {
    const user = await this.usersRepository.findIdByPublicId(publicId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.id;
  }

  async getUsersByUsername(query: SearchUserDto) {
    const findUser = await this.usersRepository.findByUsername(query.username);
    if (!findUser) {
      throw new BadRequestException('존재하는 사용자가 없습니다.');
    }
    return UserSummaryDto.fromUserEntity(findUser);
  }

  /**
   * 사용자의 페르소나를 조회합니다.
   *
   * @param userId 사용자 id
   * @returns 페르소나 정보 또는 null
   */
  async getPersona(userId: number): Promise<PersonaResponseDto | null> {
    const persona = await this.personaRepository.findByUserId(userId);
    if (!persona) {
      return null;
    }

    return {
      gender: persona.gender,
      ageGroup: persona.ageGroup,
      interests: persona.interests,
      description: persona.description || undefined,
    };
  }

  /**
   * 사용자의 페르소나를 생성합니다.
   *
   * @param userId 사용자 id
   * @param dto 페르소나 생성 DTO
   * @returns 생성된 페르소나 정보
   */
  async createPersona(userId: number, dto: CreatePersonaDto): Promise<PersonaResponseDto> {
    // 이미 페르소나가 존재하는지 확인
    const existingPersona = await this.personaRepository.findByUserId(userId);
    if (existingPersona) {
      throw new BadRequestException('Persona already exists. Use PUT to update.');
    }

    const persona = new Persona();
    persona.userId = userId;
    persona.gender = dto.gender;
    persona.ageGroup = dto.ageGroup;
    persona.interests = dto.interests;
    persona.description = dto.description || null;

    const saved = await this.personaRepository.save(persona);

    return {
      gender: saved.gender,
      ageGroup: saved.ageGroup,
      interests: saved.interests,
      description: saved.description || undefined,
    };
  }

  /**
   * 사용자의 페르소나를 전체 수정합니다.
   *
   * @param userId 사용자 id
   * @param dto 페르소나 업데이트 DTO
   * @returns 업데이트된 페르소나 정보
   */
  async updatePersona(userId: number, dto: UpdatePersonaDto): Promise<PersonaResponseDto> {
    const persona = await this.personaRepository.findByUserId(userId);
    if (!persona) {
      throw new NotFoundException('Persona not found. Use POST to create.');
    }

    // DTO에 있는 필드만 업데이트
    if (dto.gender !== undefined) persona.gender = dto.gender;
    if (dto.ageGroup !== undefined) persona.ageGroup = dto.ageGroup;
    if (dto.interests !== undefined) persona.interests = dto.interests;
    if (dto.description !== undefined) persona.description = dto.description;

    const updated = await this.personaRepository.save(persona);

    return {
      gender: updated.gender,
      ageGroup: updated.ageGroup,
      interests: updated.interests,
      description: updated.description || undefined,
    };
  }
}
