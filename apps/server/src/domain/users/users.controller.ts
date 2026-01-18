import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject() private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@UserId() userId: number) {
    return this.usersService.getUserSummary(userId);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProfile(@UserId() userId: number) {
    return this.usersService.deleteUser(userId);
  }

  @Patch()
  updateProfile() {
    throw new Error('Method not implemented.');
  }
}
