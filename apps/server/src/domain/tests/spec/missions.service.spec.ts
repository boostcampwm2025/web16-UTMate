import { Test, TestingModule } from '@nestjs/testing';

import { MissionResultsService } from '../../mission-result/misson-results.service';
import { ParticipantsService } from '../../participants/participants.service';
import { MissionRepository } from '../missions.repository';
import { MissionsService } from '../missions.service';

describe('MissionsService', () => {
  let service: MissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        { provide: MissionRepository, useValue: {} },
        { provide: ParticipantsService, useValue: {} },
        { provide: MissionResultsService, useValue: {} },
      ],
    }).compile();
    service = module.get<MissionsService>(MissionsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
