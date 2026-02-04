import { User } from '../entities/user.entity';

export class UserSummaryDto {
  publicId: string;
  username: string;
  avatarUrl: string;
  email?: string;

  static fromUserEntity(user: User): UserSummaryDto {
    const dto = new UserSummaryDto();
    dto.publicId = user.publicId;
    dto.username = user.username;
    dto.avatarUrl = user.avatarUrl;
    return dto;
  }

  static fromUserEntityWithEmail(user: User): UserSummaryDto {
    const dto = new UserSummaryDto();
    dto.publicId = user.publicId;
    dto.username = user.username;
    dto.avatarUrl = user.avatarUrl;
    dto.email = user.email;
    return dto;
  }

  static fromUserEntities(users: User[]): UserSummaryDto[] {
    return users.map((user) => this.fromUserEntity(user));
  }
}
