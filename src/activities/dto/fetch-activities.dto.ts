import { CategoryENUM, ActTypeENUM } from './../activity.model';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsPositive,
  IsISO8601,
} from 'class-validator';

export class FetchActivitiesDTO {
  @IsOptional() @IsNumberString() page: string;
  @IsOptional() @IsNumberString() size: string;
  @IsOptional() @IsString() search: string;
  @IsOptional() @IsString() account: string;
  @IsOptional() @IsString() category: CategoryENUM;
  @IsOptional() @IsISO8601() @IsString() date: string;
  @IsOptional() @IsString() type: ActTypeENUM;
  @IsOptional() @IsString() dateType: string;
}
