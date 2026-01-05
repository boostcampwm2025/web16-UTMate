import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OAuthProvider, User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findByOAuth(providerId: string, provider: OAuthProvider) {
    return this.userRepository.findOneBy({ providerId, provider });
  }
}
