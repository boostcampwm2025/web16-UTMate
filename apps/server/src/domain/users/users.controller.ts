import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreatePersonaDto, PersonaResponseDto, UpdatePersonaDto } from './dto/persona.dto';
import { SearchUserDto } from './dto/search-user.dto';
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

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserByUsername(@Query() query: SearchUserDto) {
    return this.usersService.getUsersByUsername(query);
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

  @Get('/persona')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '페르소나 조회' })
  @ApiResponse({ status: 200, description: '페르소나 조회 성공', type: PersonaResponseDto })
  @ApiResponse({ status: 404, description: '페르소나가 존재하지 않음' })
  async getPersona(@UserId() userId: number) {
    return this.usersService.getPersona(userId);
  }

  @Post('/persona')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '페르소나 생성' })
  @ApiResponse({ status: 201, description: '페르소나 생성 성공', type: PersonaResponseDto })
  @ApiResponse({ status: 400, description: '이미 페르소나가 존재함' })
  async createPersona(@UserId() userId: number, @Body() dto: CreatePersonaDto) {
    return this.usersService.createPersona(userId, dto);
  }

  @Put('/persona')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '페르소나 수정' })
  @ApiResponse({ status: 200, description: '페르소나 수정 성공', type: PersonaResponseDto })
  @ApiResponse({ status: 404, description: '페르소나가 존재하지 않음' })
  async updatePersona(@UserId() userId: number, @Body() dto: UpdatePersonaDto) {
    return this.usersService.updatePersona(userId, dto);
  }
}
