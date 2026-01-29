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
    // email이 있으면 포함
    if (user.email) {
      dto.email = user.email;
    }
    return dto;
  }

  static fromUserEntities(users: User[]): UserSummaryDto[] {
    return users.map((user) => this.fromUserEntity(user));
  }
}
