import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { GithubStrategy } from './strategies/github.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule.register({ session: false })],
  controllers: [AuthController],
  providers: [GithubStrategy, AuthService],
})
export class AuthModule {}
