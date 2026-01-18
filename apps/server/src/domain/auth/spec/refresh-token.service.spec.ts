import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

import { RT_REDIS } from '#common/redis/redis.module';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: RT_REDIS, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: TokenService, useValue: {} },
      ],
    }).compile();
    service = module.get<RefreshTokenService>(RefreshTokenService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
