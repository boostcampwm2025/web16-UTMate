import { Profile } from 'passport-github2';

import { OAuthProvider, User } from '#domain/users/entities/user.entity';

export class OAuthUserDto {
  provider: OAuthProvider;
  providerId: string;
  username: string;
  email: string;
  avatarUrl: string;

  private constructor() {}

  static fromGithubUser(profile: Profile): OAuthUserDto {
    const dto = new OAuthUserDto();
    dto.provider = OAuthProvider.github;
    dto.providerId = profile.id;
    dto.username = profile.username || '';
    dto.email = profile.emails?.[0]?.value || '';
    dto.avatarUrl = profile.photos?.[0]?.value || '';
    return dto;
  }

  toUserEntity() {
    const user = new User();
    user.provider = this.provider;
    user.providerId = this.providerId;
    user.username = this.username;
    user.email = this.email;
    user.avatarUrl = this.avatarUrl;
    return user;
  }
}
