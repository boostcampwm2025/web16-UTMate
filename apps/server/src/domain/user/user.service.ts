import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

import { OAuthUserDto } from '#domain/user/dto/oauth-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerOrUpdateUser(oauthUser: OAuthUserDto): Promise<void> {
    const user = oauthUser.toUserEntity();
    const findUser = await this.userRepository.findByOAuth(
      oauthUser.providerId,
      oauthUser.provider,
    );

    // 사용자가 존재하지 않는 경우 새로 등록
    if (!findUser) {
      await this.userRepository.save(user);
      return;
    }

    // 사용자가 존재하는 경우 정보 업데이트
    findUser.username = oauthUser.username;
    findUser.email = oauthUser.email;
    findUser.avatarUrl = oauthUser.avatarUrl;

    await this.userRepository.save(findUser);
  }
}
