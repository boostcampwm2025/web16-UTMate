import { IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

import { UserSummaryDto } from '#domain/users/dto/user-summary.dto';

export class TestSummaryDto {
  @IsString()
  title: string;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsBoolean()
  sdkStatus: boolean;

  @IsObject()
  owner: UserSummaryDto;

  private constructor() {}

  static fromTestEntity(test: Test) {
    const dto = new TestSummaryDto();
    dto.title = test.title;
    dto.status = test.status;
    dto.sdkStatus = test.sdkStatus;
    dto.owner = UserSummaryDto.fromUserEntity(test.owner);
    return dto;
  }

  static fromTestEntities(tests: Test[]) {
    return tests.map((test) => this.fromTestEntity(test));
  }
}
