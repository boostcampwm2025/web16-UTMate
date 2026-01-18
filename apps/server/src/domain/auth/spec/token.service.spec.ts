import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '../token.service';
describe('TokenService', () => {
  let service: TokenService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
