import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { RefreshTokenService } from '../refresh-token.service';
import { TokenService } from '../token.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: RefreshTokenService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: TokenService, useValue: {} },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
