import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JWT_REFRESH } from '../const';

@Injectable()
export class RtAuthGuard extends AuthGuard(JWT_REFRESH) {
  handleRequest<RtPayloadDto>(
    err?: Error,
    user?: RtPayloadDto,
    _info?: unknown,
    context?: ExecutionContext,
  ): RtPayloadDto | undefined {
    if (err || !user) {
      // refresh token 검증 실패 시 바로 쿠키 클리어
      if (context) {
        const response = context.switchToHttp().getResponse();
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
