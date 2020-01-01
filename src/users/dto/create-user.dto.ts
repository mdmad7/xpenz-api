import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsEmail,
  IsISO8601,
  Length,
  IsOptional,
} from 'class-validator';
import { GenderENUM } from '../user.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ description: 'First name of user', example: 'Michael' })
  @IsNotEmpty()
  @IsString()
  firstname: string;
  @ApiProperty({
    description: 'Last name of user',
    example: 'Davis',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @ApiProperty({
    description:
      'Email of user. THis is a unique field and must not already be in the db',
    example: 'mdmad7@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiPropertyOptional({
    enum: GenderENUM,
    example: 'Male',
    description:
      'Gender of user. Can be left empty, will be defaulted to "Unspecified"',
  })
  @IsOptional()
  @IsString()
  @IsIn(['Female', 'Male', 'Unspecified'])
  gender: GenderENUM;
  @ApiProperty({
    description:
      'Unique password provided by user. Should be 6 characters or more long.',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6)
  password: string;
  @ApiProperty({
    description:
      'Date of birth of user. Should be of a valid ISO8601 date type ',
    example: '1991-10-27',
  })
  @IsNotEmpty()
  @IsISO8601()
  dob: string;
}
// $2a$10$3z6jFxPxZhKq5BUzfKAhwOEYvCC3oHcwgEUmy/rTphnragxIGelIG
