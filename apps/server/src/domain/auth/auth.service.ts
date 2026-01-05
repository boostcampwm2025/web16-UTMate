import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenDto } from './dto/token.dto';

import { OAuthUserDto } from '#domain/user/dto/oauth-user.dto';
import { UserService } from '#domain/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly jwtService: JwtService,
    @Inject() private readonly config: ConfigService,
  ) {}

  async login(user: OAuthUserDto): Promise<TokenDto> {
    const publicId = await this.userService.registerOrUpdateUser(user);

    // RTR을 위한 토큰 패밀리 식별자
    const familyId = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: publicId, familyId },
        { expiresIn: this.config.get<number>('JWT_ACCESS_EXPIRES_IN') },
      ),
      this.jwtService.signAsync(
        { sub: publicId, familyId },
        { expiresIn: this.config.get<number>('JWT_REFRESH_EXPIRES_IN') },
      ),
    ]);

    return new TokenDto(accessToken, refreshToken);
  }
}
