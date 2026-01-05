import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GithubStrategy } from './strategies/github.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ENV_KEYS } from '#common/config/env.constants';
import { UserModule } from '#domain/user/user.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(ENV_KEYS.JWT_SECRET)!,
        signOptions: {
          expiresIn: config.get<number>(ENV_KEYS.JWT_ACCESS_EXPIRES_IN)!,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [GithubStrategy, AuthService],
})
export class AuthModule {}
