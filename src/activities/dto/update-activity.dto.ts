import { IsOptional, IsNumberString, IsString, IsIn } from 'class-validator';
import { ActTypeENUM } from '../activity.model';

export class UpdateActivityDTO {
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsNumberString() amount: string;
  @IsOptional()
  @IsString()
  @IsIn(['EXPENDITURE', 'REVENUE', 'SAVING', 'INVESTMENT'])
  type: ActTypeENUM;
}
