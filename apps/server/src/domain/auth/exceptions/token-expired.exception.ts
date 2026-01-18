import { UnauthorizedException } from '@nestjs/common';

import { AuthErrorCode } from '../enums';

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      code: AuthErrorCode.EXPIRED,
      message: '토큰이 만료되었습니다.',
    });
  }
}
