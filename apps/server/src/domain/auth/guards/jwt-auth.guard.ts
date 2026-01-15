import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT } from '../const';
import { TokenExpiredException, TokenInvalidException, TokenMissingException } from '../exceptions';

export interface Info {
  name: string;
  message: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT) {
  handleRequest<JwtPayloadDto>(
    err?: Error,
    user?: JwtPayloadDto,
    info?: Info,
    context?: ExecutionContext,
  ): JwtPayloadDto {
    // 만료된 토큰
    if (info?.name === 'TokenExpiredError') {
      throw new TokenExpiredException();
    }

    // 잘못된 토큰 (서명 불일치, 위조 등)
    if (info?.name === 'JsonWebTokenError') {
      // 쿠키 클리어
      if (context) {
        const response = context.switchToHttp().getResponse();
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
      }
      throw new TokenInvalidException();
    }

    if (!user) {
      throw new TokenMissingException();
    }

    // hanldeRequset
    if (err) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
