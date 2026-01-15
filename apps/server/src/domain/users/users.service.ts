import { BadRequestException, Injectable } from '@nestjs/common';

import { UserSummaryDto } from './dto/user-summary.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * OAuthUserDto를 기반으로 사용자를 등록하거나 업데이트합니다.
   * @param oauthUser
   * @returns publicId : jwt 생성 payload에 사용됩니다.
   */
  async registerOrUpdateUser(oauthUser: OAuthUserDto): Promise<string> {
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
   * JWT 검증 후 받은 id 기반으로 사용자 요약 정보를 반환합니다.
   * @param id 토큰을 파싱하여 나온 id
   * @returns UserSummaryDto - 사용자 요약 정보
   */
  async getUserSummary(id: number) {
    const user = await this.usersRepository.findSummary(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return UserSummaryDto.fromUserEntity(user);
  }

  /**
   * JWT 검증 후 받은 id를 기반으로 사용자를 삭제합니다.
   * @param id 토큰을 파싱하여 나온 id
   */
  async deleteUser(id: number) {
    this.usersRepository.delete(id);
  }

  /**
   * 토큰 파싱 후 나온 publicId를 기반으로 사용자의 id를 반환합니다.
   * 커버링 인덱스를 사용하여 id만 조회합니다.
   * @param publicId 토큰을 파싱하여 나온 publicId
   * @returns User - id만 가진 User 엔티티
   */
  async getIdByPublicId(publicId: string): Promise<User> {
    const user = await this.usersRepository.findIdByPublicId(publicId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
