import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsEmail,
  IsISO8601,
  Length,
} from 'class-validator';
import { GenderENUM } from '../user.model';

export class CreateUserDTO {
  @IsNotEmpty() @IsString() firstname: string;
  @IsNotEmpty() @IsString() lastname: string;
  @IsNotEmpty() @IsString() @IsEmail() email: string;
  @IsString()
  @IsIn(['Female', 'Male', 'Unspecified'])
  gender: GenderENUM;
  @IsNotEmpty() @IsString() @Length(6) password: string;
  @IsNotEmpty() @IsISO8601() dob: string;
}
