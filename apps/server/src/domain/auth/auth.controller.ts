import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { OAuthUserDto } from './dto/oauth-user.dto';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { AuthService } from './auth.service';

import { ENV_KEYS } from '#common/config/env.constants';

interface RequestWithUser extends Request {
  user: OAuthUserDto;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(): Promise<void> {
    // Guard가 GitHub로 리다이렉트
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: RequestWithUser, @Res() res: Response): Promise<void> {
    const _user = req.user;

    // const { accessToken, refreshToken } = await this.authService.login(user);
    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    // });

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   path: '/api/auth/reissue',
    // });

    res.redirect(this.config.get<string>(ENV_KEYS.CLIENT_URL)!);
  }
}
