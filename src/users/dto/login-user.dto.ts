import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty() @IsString() @IsEmail() email: string;
  @IsNotEmpty() @IsString() @Length(6) password: string;
}
