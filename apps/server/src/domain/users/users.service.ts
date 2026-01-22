import { BadRequestException, Injectable } from '@nestjs/common';

import { UserSummaryDto } from './dto/user-summary.dto';
import { UsersRepository } from './users.repository';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
