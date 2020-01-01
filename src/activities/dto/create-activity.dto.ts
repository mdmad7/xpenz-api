import { CategoryENUM } from './../activity.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsIn,
  IsISO8601,
  IsOptional,
} from 'class-validator';
import { ActTypeENUM } from '../activity.model';

export class CreateActivityDTO {
  @ApiProperty({
    description: 'The title of the activity performed',
    example: 'KFC Date',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiPropertyOptional({
    description: 'The description of the activity performed',
    example: 'Went on a date with *** at KFC Accra mall branch',
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Cost of expenditure or amount gained from revenue',
    example: '85.45',
  })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;
  @ApiPropertyOptional({
    description:
      'Will default to "Wallet" if user has not created any accounts. Will be denoted by the id of the account, else "Wallet"',
    example: '5e0cb79611fb1857323aca47',
  })
  @IsOptional()
  @IsString()
  account: string;
  @ApiProperty({
    description: 'Select the type of activity performed',
    example: 'EXPENDITURE',
    enum: ActTypeENUM,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['EXPENDITURE', 'REVENUE'])
  type: ActTypeENUM;
  @ApiProperty({
    description: 'Select the category activity falls under',
    example: 'Food & Drinks',
    enum: CategoryENUM,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'Automobile',
    'Salary',
    'Savings',
    'Investment',
    'Shopping',
    'Food & Drinks',
    'Education',
    'Entertainment',
    'Furniture',
    'Gadget',
    'Gift',
    'Groceries',
    'Fitness',
    'Loan',
    'Medical',
    'Misc',
    'Housing',
    'Clothing',
    'Transport',
    'Travel',
    'Utilities',
  ])
  category: CategoryENUM;
  @ApiPropertyOptional({
    description:
      'Select the date/time this activity was performed. Will be set to time of saving activity if left empty. Must be of a valid ISO8601 format',
    example: '1991-10-27',
  })
  @IsOptional()
  @IsString()
  @IsISO8601()
  date: string;
}
