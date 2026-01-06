import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { JwtPayload, OAuthUser, RtPayload } from './decorator/param.decorator';
import { JwtPayloadDto, RtPayloadDto } from './dto/jwt-payload.dto';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

import { ENV_KEYS } from '#common/config/env.constants';
import { OAuthUserDto } from '#domain/user/dto/oauth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly config: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(): Promise<void> {
    // Guard가 GitHub로 리다이렉트
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@OAuthUser() user: OAuthUserDto, @Res() res: Response): Promise<void> {
    const token = await this.authService.login(user);
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.config.get<number>(ENV_KEYS.JWT_ACCESS_EXPIRES_IN)!,
    });

    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/reissue',
      maxAge: this.config.get<number>(ENV_KEYS.JWT_REFRESH_EXPIRES_IN)!,
    });

    res.sendStatus(200);
  }

  @Post('reissue')
  @UseGuards(RtAuthGuard)
  async reissue(@RtPayload() payload: RtPayloadDto, @Res() res: Response): Promise<void> {
    const token = await this.refreshTokenService.rotateRefreshToken(
      payload.userId,
      payload.familyId,
      payload.refreshToken,
    );

    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.config.get<number>(ENV_KEYS.JWT_ACCESS_EXPIRES_IN)!,
    });

    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/reissue',
      maxAge: this.config.get<number>(ENV_KEYS.JWT_REFRESH_EXPIRES_IN)!,
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@JwtPayload() payload: JwtPayloadDto, @Res() res: Response): Promise<void> {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/auth/reissue' });

    res.sendStatus(200);
  }
}
