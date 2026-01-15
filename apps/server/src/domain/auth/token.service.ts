import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenDto } from './dto/token.dto';

import { ENV_KEYS } from '#common/config/env.constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Access Token, Refresh Token 쌍을 생성합니다.
   * @param sub payload 내 sub로 사용됩니다.
   * @param familyId payload 내 familyId로 사용됩니다.
   * @returns TokenDto
   */
  async generateTokenPair(sub: string, familyId: string): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub, familyId },
        {
          secret: this.config.get<string>(ENV_KEYS.JWT_ACCESS_SECRET)!,
          expiresIn: this.config.get<number>(ENV_KEYS.JWT_ACCESS_EXPIRES_IN)!,
        },
      ),
      this.jwtService.signAsync(
        { sub, familyId },
        {
          secret: this.config.get<string>(ENV_KEYS.JWT_REFRESH_SECRET)!,
          expiresIn: this.config.get<number>(ENV_KEYS.JWT_REFRESH_EXPIRES_IN)!,
        },
      ),
    ]);

    return new TokenDto(accessToken, refreshToken);
  }
}
