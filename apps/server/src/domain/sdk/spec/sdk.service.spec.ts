import { Test, TestingModule } from '@nestjs/testing';

import { SdkService } from '../sdk.service';

import { StorageService } from '#common/storage/storage.service';
import { TestsService } from '#domain/tests/tests.service';

describe('SdkService', () => {
  let service: SdkService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkService,
        { provide: StorageService, useValue: {} },
        { provide: TestsService, useValue: {} },
      ],
    }).compile();
    service = module.get<SdkService>(SdkService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
