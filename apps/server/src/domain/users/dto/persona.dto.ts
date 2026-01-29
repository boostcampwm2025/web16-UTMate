import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { AgeRange, Gender, Interest } from '#common/enums';

export class CreatePersonaDto {
  @ApiProperty({ enum: Gender, description: '성별' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ enum: AgeRange, description: '연령대' })
  @IsEnum(AgeRange)
  @IsNotEmpty()
  ageGroup: AgeRange;

  @ApiProperty({
    enum: Interest,
    isArray: true,
    description: '관심사 목록',
    example: [Interest.IT, Interest.GAMING],
  })
  @IsArray()
  @IsEnum(Interest, { each: true })
  @IsNotEmpty()
  interests: Interest[];

  @ApiProperty({ description: '추가 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePersonaDto {
  @ApiProperty({ enum: Gender, description: '성별', required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ enum: AgeRange, description: '연령대', required: false })
  @IsEnum(AgeRange)
  @IsOptional()
  ageGroup?: AgeRange;

  @ApiProperty({
    enum: Interest,
    isArray: true,
    description: '관심사 목록',
    required: false,
  })
  @IsArray()
  @IsEnum(Interest, { each: true })
  @IsOptional()
  interests?: Interest[];

  @ApiProperty({ description: '추가 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class PersonaResponseDto {
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: AgeRange })
  ageGroup: AgeRange;

  @ApiProperty({ enum: Interest, isArray: true })
  interests: Interest[];

  @ApiProperty({ required: false })
  description?: string;
}
