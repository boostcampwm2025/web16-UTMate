import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT } from '../const';
import { TokenExpiredException } from '../exceptions';

import { Info } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard(JWT) {
  handleRequest<JwtPayloadDto>(
    err?: Error,
    user?: JwtPayloadDto,
    info?: Info,
    context?: ExecutionContext,
  ): JwtPayloadDto | undefined {
    if (err) throw err;

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
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
    return user || undefined;
  }
}
