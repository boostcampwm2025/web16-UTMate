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

import { JwtPayload } from '#domain/auth/decorator/param.decorator';
import { JwtPayloadDto } from '#domain/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject() private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@JwtPayload() payload: JwtPayloadDto) {
    return this.usersService.getUserSummaryById(payload.userId);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProfile(@JwtPayload() payload: JwtPayloadDto) {
    return this.usersService.deleteUser(payload.userId);
  }

  @Patch()
  updateProfile() {
    throw new Error('Method not implemented.');
  }
}
