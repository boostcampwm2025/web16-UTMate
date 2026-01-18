import { Test, TestingModule } from '@nestjs/testing';

import { S3StorageService } from '../../../common/storage/s3-storage.service';
import { StorageService } from '../../../common/storage/storage.service';
import { MissionResultsRepository } from '../mission-results.repository';
import { MissionResultsService } from '../misson-results.service';

describe('MissionResultsService', () => {
  let service: MissionResultsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionResultsService,
        { provide: MissionResultsRepository, useValue: {} },
        { provide: StorageService, useValue: {} },
        { provide: S3StorageService, useValue: {} },
      ],
    }).compile();
    service = module.get<MissionResultsService>(MissionResultsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
