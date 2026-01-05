import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { OAuthUserDto } from '../dto/oauth-user.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
      scope: ['user:email'],
    });
  }

  async validate(_atk: string, _rtk: string, profile: Profile): Promise<OAuthUserDto> {
    return OAuthUserDto.fromGithubUser(profile);
  }
}
