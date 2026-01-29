import { IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

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
    dto.owner = UserSummaryDto.fromUserEntity(test.owner);
    dto.members = UserSummaryDto.fromUserEntities(test.members);
    return dto;
  }

  static fromTestEntities(tests: Test[]) {
    return tests.map((test) => this.fromTestEntity(test));
  }
}
