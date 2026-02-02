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

  async findSummary(id: number) {
    return this.usersRepository
      .createQueryBuilder('users')
      .select(['users.publicId', 'users.username', 'users.avatarUrl', 'users.email'])
      .where('users.id = :id', { id })
      .getOne();
  }

  async delete(id: number) {
    await this.usersRepository.delete({ id });
  }

  async findIdByPublicId(publicId: string) {
    return this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id'])
      .where('users.publicId = :publicId', { publicId })
      .getOne();
  }

  async findByUsername(username: string) {
    return this.usersRepository
      .createQueryBuilder('users')
      .where('LOWER(users.username) = :username', { username: username.toLowerCase() })
      .getOne();
  }
}
