import { IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';

import { Test } from '../entities/test.entity';
import { TestStatus } from '../enums';

import { UserSummaryDto } from '#domain/users/dto/user-summary.dto';

export class TestSummaryDto {
  @IsString()
  publicId: string;

  @IsString()
  title: string;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsBoolean()
  sdkStatus: boolean;

  @IsString()
  url: string;

  @IsObject()
  owner: UserSummaryDto;

  @IsObject()
  members: UserSummaryDto[];

  private constructor() {}

  static fromTestEntity(test: Test) {
    const dto = new TestSummaryDto();
    dto.publicId = test.publicId;
    dto.title = test.title;
    dto.status = test.status;
    dto.sdkStatus = test.sdkStatus;
    dto.url = test.url;

    if (test.status === TestStatus.DEMO) {
      dto.owner = new UserSummaryDto();

      // 데모 테스트의 소유자는 고정값으로 설정
      dto.owner.publicId = 'demo-owner';
      dto.owner.avatarUrl = 'https://utmate.me/images/icons/penguin.webp';
      dto.owner.username = 'UTMate Demo';
      dto.members = [];
      return dto;
    }
    dto.owner = UserSummaryDto.fromUserEntity(test.owner);
    dto.members = UserSummaryDto.fromUserEntities(test.members);
    return dto;
  }

  static fromTestEntities(tests: Test[]) {
    return tests.map((test) => this.fromTestEntity(test));
  }
}
