import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { ParticipantsService } from '../../participants/participants.service';
import { MissionsService } from '../missions.service';
import { TestsRepository } from '../tests.repository';
import { TestsService } from '../tests.service';

describe('TestsService', () => {
  let service: TestsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        { provide: TestsRepository, useValue: {} },
        { provide: MissionsService, useValue: {} },
        { provide: ParticipantsService, useValue: {} },
        { provide: DataSource, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();
    service = module.get<TestsService>(TestsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
