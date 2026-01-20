import { Inject, Injectable } from '@nestjs/common';

import { TokenDto } from './dto/token.dto';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';
import { UsersService } from '#domain/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly refreshTokenService: RefreshTokenService,
    @Inject() private readonly usersService: UsersService,
    @Inject() private readonly tokenService: TokenService,
  ) {}

  /**
   * 로그인/회원가입을 처리하고 토큰 쌍을 생성합니다.
   * refreshToken을 redis에 저장합니다.
   *
   * @param oAuthUserDto  OAuth 인증 후 반환된 사용자 정보
   * @returns TokenDto : 액세스 토큰과 리프레시 토큰
   */
  async login(oAuthUserDto: OAuthUserDto): Promise<TokenDto> {
    const publicId = await this.usersService.registerOrUpdateUser(oAuthUserDto);

    // RTR을 위한 토큰 패밀리 식별자
    const familyId = crypto.randomUUID();

    const tokenDto = await this.tokenService.generateTokenPair(publicId, familyId);

    await this.refreshTokenService.saveRefreshToken(publicId, familyId, tokenDto.refreshToken);

    return tokenDto;
  }
}
