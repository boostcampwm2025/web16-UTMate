import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_REFRESH } from '../const';
import { RtPayloadDto } from '../dto/jwt-payload.dto';

import { ENV_KEYS } from '#common/config/env.constants';

interface Payload {
  sub: string;
  familyId: string;
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, JWT_REFRESH) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token ?? null,
      ]),
      secretOrKey: config.get<string>(ENV_KEYS.JWT_REFRESH_SECRET)!,
      passReqToCallback: true,
    });
  }

  // 검증 성공 시 호출됨
  validate(req: Request, payload: Payload) {
    // 쿠키에서 토큰 원본을 다시 꺼냄 (RTR 비교용)
    const refreshToken = req.cookies.refresh_token;

    return new RtPayloadDto(payload.sub, payload.familyId, refreshToken);
  }
}
