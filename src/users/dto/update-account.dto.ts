import { AccountTypeENUM } from '../user.model';
import { IsString, IsIn, IsNumberString, IsOptional } from 'class-validator';

export class UpdateAccountDTO {
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsNumberString() starterAmount: string;
  @IsString()
  @IsOptional()
  @IsIn(['DIGITAL WALLET', 'BANK', 'CREDIT CARD'])
  type: AccountTypeENUM;
  @IsOptional() @IsString() theme: string;
}
