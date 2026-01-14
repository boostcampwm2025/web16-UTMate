import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { CreateParticipantDto } from './dto/create-participant.dto';
import { ParticipantsService } from './participants.service';

import { UserId } from '#domain/auth/decorator/param.decorator';
import { OptionalJwtAuthGuard } from '#domain/auth/guards/optional-jwt-auth.guard';

@Controller('/participants')
export class ParticipantsController {
  constructor(@Inject() private readonly participantsService: ParticipantsService) {}

  @Get()
  async getParticipants() {
    //TODO 이어하기를 위한 정보 반환
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async createParticipant(
    @UserId() userId: number | undefined,
    @Body() createParticipantDto: CreateParticipantDto,
  ) {
    return await this.participantsService.createParticipant(userId, createParticipantDto);
  }
}
