import { Test, TestingModule } from '@nestjs/testing';

import { ParticipantsRepository } from '../participants.repository';
import { ParticipantsService } from '../participants.service';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantsService, { provide: ParticipantsRepository, useValue: {} }],
    }).compile();
    service = module.get<ParticipantsService>(ParticipantsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
