import { Controller, Get, Inject } from '@nestjs/common';

import { ParticipantsService } from './participants.service';

@Controller('/participants')
export class ParticipantsController {
  constructor(@Inject() private readonly participantsService: ParticipantsService) {}

  @Get()
  async getParticipants() {
    //TODO 이어하기를 위한 정보 반환
  }
}
