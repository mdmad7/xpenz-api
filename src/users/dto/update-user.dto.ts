import { IsString, IsIn, IsISO8601, IsOptional } from 'class-validator';
import { GenderENUM } from '../user.model';

export class UpdateUserDTO {
  @IsOptional() @IsString() firstname: string;
  @IsOptional() @IsString() lastname: string;
  @IsOptional()
  @IsString()
  @IsOptional()
  @IsIn(['Female', 'Male', 'Unspecified'])
  gender: GenderENUM;
  @IsOptional() @IsISO8601() dob: string;
}
