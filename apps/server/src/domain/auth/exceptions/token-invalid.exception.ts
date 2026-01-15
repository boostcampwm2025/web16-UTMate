import { UnauthorizedException } from '@nestjs/common';

import { AuthErrorCode } from '../enums';

export class TokenInvalidException extends UnauthorizedException {
  constructor() {
    super({
      code: AuthErrorCode.INVALID,
      message: '토큰이 유효하지 않습니다.',
    });
  }
}
