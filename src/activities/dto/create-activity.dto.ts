import { IsNotEmpty, IsNumberString, IsString, IsIn } from 'class-validator';
import { ActTypeENUM } from '../activity.model';

export class CreateActivityDTO {
  @IsNotEmpty() @IsString() title: string;
  @IsString() description: string;
  @IsNotEmpty() @IsNumberString() amount: string;
  @IsString()
  @IsNotEmpty()
  @IsIn(['EXPENDITURE', 'REVENUE', 'SAVING', 'INVESTMENT'])
  type: ActTypeENUM;
  // @IsNotEmpty() @IsString() @IsMongoId() owner: string;
}
