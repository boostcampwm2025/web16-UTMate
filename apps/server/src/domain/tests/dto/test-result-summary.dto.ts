import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Test, TestStatus } from '../entities/test.entity';

export class TestResultSummaryDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsEnum(TestStatus)
  status: TestStatus;

  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  totalParticipants: number;

  static fromTest(test: Test) {
    const dto = new TestResultSummaryDto();
    dto.id = test.publicId;
    dto.title = test.title;
    dto.status = test.status;
    dto.description = test.description;
    dto.startDate = test.startDate;
    dto.endDate = test.endDate;
    dto.totalParticipants = test.totalParticipants;
    return dto;
  }
}
