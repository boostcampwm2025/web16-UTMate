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

import { UserService } from './user.service';

import { JwtPayload } from '#domain/auth/decorator/param.decorator';
import { JwtPayloadDto } from '#domain/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from '#domain/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@JwtPayload() payload: JwtPayloadDto) {
    return this.userService.getUserSummaryById(payload.userId);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProfile(@JwtPayload() payload: JwtPayloadDto) {
    return this.userService.deleteUser(payload.userId);
  }

  @Patch()
  updateProfile() {
    throw new Error('Method not implemented.');
  }
}
