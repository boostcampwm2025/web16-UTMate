import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';

import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsRepository {
  constructor(
    @InjectRepository(Participant) private readonly participantsRepository: Repository<Participant>,
  ) {}
}
