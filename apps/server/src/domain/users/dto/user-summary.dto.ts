import { User } from '../entities/user.entity';

export class UserSummaryDto {
  publicId: string;
  role: string;
  username: string;
  avatarUrl: string;

  static fromUserEntity(user: User): UserSummaryDto {
    const dto = new UserSummaryDto();
    dto.publicId = user.publicId;
    dto.username = user.username;
    dto.avatarUrl = user.avatarUrl;
    return dto;
  }

  static fromUserEntities(users: User[]): UserSummaryDto[] {
    return users.map((user) => this.fromUserEntity(user));
  }
}
