import { Controller, Inject } from '@nestjs/common';

import { ParticipantsService } from './participants.service';

@Controller('/participants')
export class ParticipantsController {
  constructor(@Inject() private readonly participantsService: ParticipantsService) {}
}
