import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadDto } from '../dto/jwt-payload.dto';

import { ENV_KEYS } from '#common/config/env.constants';

interface Payload {
  sub: string;
  familyId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(ENV_KEYS.JWT_ACCESS_SECRET)!,
    });
  }

  validate(payload: Payload): JwtPayloadDto {
    return new JwtPayloadDto(payload.sub, payload.familyId);
  }
}
