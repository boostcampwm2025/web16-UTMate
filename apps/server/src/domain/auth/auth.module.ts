import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GithubStrategy } from './strategies/github.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';

import { ENV_KEYS } from '#common/config/env.constants';
import { UsersModule } from '#domain/users/users.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(ENV_KEYS.JWT_ACCESS_SECRET)!,
        signOptions: {
          expiresIn: config.get<number>(ENV_KEYS.JWT_ACCESS_EXPIRES_IN)!,
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    GithubStrategy,
    JwtStrategy,
    RtStrategy,
    AuthService,
    RefreshTokenService,
    TokenService,
  ],
})
export class AuthModule {}
