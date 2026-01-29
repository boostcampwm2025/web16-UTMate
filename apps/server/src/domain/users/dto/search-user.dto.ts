import { IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  username: string;
}
