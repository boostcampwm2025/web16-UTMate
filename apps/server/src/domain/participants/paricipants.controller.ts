import { Controller, Get, Inject, Param } from '@nestjs/common';

import { ParticipantsService } from './participants.service';

@Controller('/participants')
export class ParticipantsController {
  constructor(@Inject() private readonly participantsService: ParticipantsService) {}

  @Get('/:id')
  async getMissionProgress(@Param('id') publicId: string) {
    return this.participantsService.getMissionProgress(publicId);
  }
}
