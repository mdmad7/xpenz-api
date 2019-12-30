import { CategoryENUM } from './../activity.model';
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
  @IsNotEmpty() @IsString() title: string;
  @IsString() description: string;
  @IsNotEmpty() @IsNumberString() amount: string;
  @IsString()
  @IsNotEmpty()
  @IsIn(['EXPENDITURE', 'REVENUE', 'SAVINGS', 'INVESTMENT'])
  type: ActTypeENUM;
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
  @IsOptional() @IsString() @IsISO8601() date: string;
}
