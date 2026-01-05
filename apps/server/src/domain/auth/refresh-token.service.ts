import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
