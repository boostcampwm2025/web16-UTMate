import { createParamDecorator } from '@nestjs/common';

import { JwtPayloadDto, RtPayloadDto } from '../dto/jwt-payload.dto';

import { OAuthUserDto } from '#domain/users/dto/oauth-user.dto';

export const OAuthUser = createParamDecorator((data, ctx) => {
  return ctx.switchToHttp().getRequest().user as OAuthUserDto;
});

export const JwtPayload = createParamDecorator((data, ctx) => {
  return ctx.switchToHttp().getRequest().user as JwtPayloadDto;
});

export const RtPayload = createParamDecorator((data, ctx) => {
  return ctx.switchToHttp().getRequest().user as RtPayloadDto;
});

export const UserId = createParamDecorator((data, ctx): string | undefined => {
  const requset = ctx.switchToHttp().getRequest();
  return requset.user?.userId;
});
