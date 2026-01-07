import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { ENV_KEYS } from '#common/config/env.constants';
import { OAuthUserDto } from '#domain/user/dto/oauth-user.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>(ENV_KEYS.GITHUB_CLIENT_ID)!,
      clientSecret: config.get<string>(ENV_KEYS.GITHUB_CLIENT_SECRET)!,
      callbackURL: config.get<string>(ENV_KEYS.GITHUB_CALLBACK_URL)!,
      scope: ['user:email'],
    });
  }

  async validate(_atk: string, _rtk: string, profile: Profile): Promise<OAuthUserDto> {
    return OAuthUserDto.fromGithubUser(profile);
  }
}
