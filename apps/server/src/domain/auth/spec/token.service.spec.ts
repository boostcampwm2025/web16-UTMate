import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '../token.service';
describe('TokenService', () => {
  let service: TokenService;
  let jwtService: { signAsync: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    jwtService = { signAsync: jest.fn() };
    configService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokenPair', () => {
    it('Access/Refresh Token 쌍을 생성해 반환한다', async () => {
      // given
      const sub = 'user-id';
      const familyId = '11111111-2222-3333-4444-555555555555';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      jwtService.signAsync.mockResolvedValueOnce(accessToken).mockResolvedValueOnce(refreshToken);
      configService.get
        .mockReturnValueOnce('access-secret')
        .mockReturnValueOnce(3600)
        .mockReturnValueOnce('refresh-secret')
        .mockReturnValueOnce(7200);

      // when
      const result = await service.generateTokenPair(sub, familyId);

      // then
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result.accessToken).toBe(accessToken);
      expect(result.refreshToken).toBe(refreshToken);
    });
  });
});
