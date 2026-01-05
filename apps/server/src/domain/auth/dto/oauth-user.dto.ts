import { Profile } from 'passport-github2';

export class OAuthUserDto {
  provider: string;
  providerId: string;
  username: string;
  email: string;
  avatarUrl: string;

  private constructor() {}

  static fromGithubUser(profile: Profile): OAuthUserDto {
    const dto = new OAuthUserDto();
    dto.provider = 'github';
    dto.providerId = profile.id;
    dto.username = profile.username || '';
    dto.email = profile.emails?.[0]?.value || '';
    dto.avatarUrl = profile.photos?.[0]?.value || '';
    return dto;
  }
}
