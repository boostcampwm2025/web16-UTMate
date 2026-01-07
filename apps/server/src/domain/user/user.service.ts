import { BadRequestException, Injectable } from '@nestjs/common';

import { UserSummaryDto } from './dto/user-summary.dto';
import { UserRepository } from './user.repository';

import { OAuthUserDto } from '#domain/user/dto/oauth-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * OAuthUserDto를 기반으로 사용자를 등록하거나 업데이트합니다.
   * @param oauthUser
   * @returns publicId : jwt 생성 payload에 사용됩니다.
   */
  async registerOrUpdateUser(oauthUser: OAuthUserDto): Promise<string> {
    // 기존 사용자 조회
    const findUser = await this.userRepository.findByOAuth(
      oauthUser.providerId,
      oauthUser.provider,
    );

    // 사용자가 존재하는 경우 정보 업데이트
    if (findUser) {
      findUser.username = oauthUser.username;
      findUser.email = oauthUser.email;
      findUser.avatarUrl = oauthUser.avatarUrl;

      await this.userRepository.save(findUser);
      return findUser.publicId;
    }

    // 사용자가 존재하지 않는 경우 새로 등록
    const user = oauthUser.toUserEntity();
    await this.userRepository.save(user);
    return user.publicId;
  }

  async getUserSummaryById(userId: string) {
    const user = await this.userRepository.findSummaryByPublicId(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return UserSummaryDto.fromUserEntity(user);
  }

  async deleteUser(userId: string) {
    this.userRepository.deleteByPublicId(userId);
  }
}
