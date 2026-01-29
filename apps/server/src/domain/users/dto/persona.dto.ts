import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AgeGroup, Gender, Interest } from '../entities/persona.entity';

export class CreatePersonaDto {
  @ApiProperty({ enum: Gender, description: '성별' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ enum: AgeGroup, description: '연령대' })
  @IsEnum(AgeGroup)
  @IsNotEmpty()
  ageGroup: AgeGroup;

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

  @ApiProperty({ enum: AgeGroup, description: '연령대', required: false })
  @IsEnum(AgeGroup)
  @IsOptional()
  ageGroup?: AgeGroup;

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

  @ApiProperty({ enum: AgeGroup })
  ageGroup: AgeGroup;

  @ApiProperty({ enum: Interest, isArray: true })
  interests: Interest[];

  @ApiProperty({ required: false })
  description?: string;
}
