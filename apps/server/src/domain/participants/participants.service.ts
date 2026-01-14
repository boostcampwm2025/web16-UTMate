import { Inject, Injectable } from '@nestjs/common';

import { ParticipantsRepository } from './participants.repository';

@Injectable()
export class ParticipantsService {
  constructor(@Inject() readonly participantsRepository: ParticipantsRepository) {}
}
