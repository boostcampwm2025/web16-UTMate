import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OAuthProvider, User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findByOAuth(providerId: string, provider: OAuthProvider) {
    return this.usersRepository.findOneBy({ providerId, provider });
  }

  async findSummaryByPublicId(userId: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .select(['user.publicId', 'user.username', 'user.avatarUrl'])
      .where('user.publicId = :userId', { userId })
      .getOne();
  }

  async deleteByPublicId(userId: string) {
    await this.usersRepository.delete({ publicId: userId });
  }
}
