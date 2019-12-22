import {
  IsNumberString,
  IsOptional,
  IsString,
  IsPositive,
} from 'class-validator';

export class FetchActivitiesDTO {
  @IsOptional() @IsNumberString() @IsPositive() page: string;
  @IsOptional() @IsNumberString() @IsPositive() size: string;
  @IsOptional() @IsString() search: string;
}
