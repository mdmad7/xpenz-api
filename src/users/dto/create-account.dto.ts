import { AccountTypeENUM } from './../user.model';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateAccountDTO {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsNumberString() starterAmount: string;
  @IsString()
  @IsIn(['DIGITAL WALLET', 'BANK', 'CREDIT CARD'])
  type: AccountTypeENUM;
  @IsOptional() @IsString() theme: string;
}
