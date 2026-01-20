import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import Redis from 'ioredis';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT } from '../const';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

import { ENV_KEYS } from '#common/config/env.constants';
import { USER_REDIS } from '#common/redis/redis.module';
import { UsersService } from '#domain/users/users.service';

interface Payload {
  sub: string;
  familyId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(
    @Inject(USER_REDIS) private readonly userRedis: Redis,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(ENV_KEYS.JWT_ACCESS_SECRET)!,
    });
  }

  async validate(payload: Payload) {
    const userId = await this.userRedis.get(payload.sub);
    if (userId) {
      return new JwtPayloadDto(payload.sub, payload.familyId, Number(userId));
    }
    const findUserId = await this.usersService.getIdByPublicId(payload.sub);
    await this.userRedis.set(payload.sub, findUserId, 'EX', 3600); // 1시간 캐싱
    return new JwtPayloadDto(payload.sub, payload.familyId, findUserId);
  }
}
