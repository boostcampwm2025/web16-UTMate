import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';

import { CompleteParticipantDto } from './dto/complete-participant.dto';
import { ParticipantsService } from './participants.service';

@Controller('/participants')
export class ParticipantsController {
  constructor(@Inject() private readonly participantsService: ParticipantsService) {}

  @Get('/:id/mission-progress')
  async getMissionProgress(@Param('id') publicId: string) {
    return this.participantsService.getMissionProgress(publicId);
  }

  @Patch('/:id')
  async completeParticipantTest(
    @Param('id') publicId: string,
    @Body() completeParticipant: CompleteParticipantDto,
  ) {
    this.participantsService.completeParticipant(publicId, completeParticipant);
  }
}
