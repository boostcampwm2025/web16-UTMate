import { UnauthorizedException } from '@nestjs/common';

import { AuthErrorCode } from '../enums';

export class TokenMissingException extends UnauthorizedException {
  constructor() {
    super({
      code: AuthErrorCode.MISSING,
      message: '토큰이 존재하지 않습니다.',
    });
  }
}
