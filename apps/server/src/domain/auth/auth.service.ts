import { Injectable } from '@nestjs/common';

import { OAuthUserDto } from './dto/oauth-user.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor() {}

  login(_user: OAuthUserDto): TokenDto {
    throw new Error('Method not implemented.');
  }
}
