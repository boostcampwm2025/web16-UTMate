import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { S3_CLIENT } from '../const';
import { S3StorageService } from '../s3-storage.service';

describe('S3StorageService', () => {
  let service: S3StorageService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3StorageService,
        { provide: S3_CLIENT, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'test-bucket',
          },
        },
      ],
    }).compile();
    service = module.get<S3StorageService>(S3StorageService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
