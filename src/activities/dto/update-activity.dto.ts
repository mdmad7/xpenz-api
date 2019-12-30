import {
  IsOptional,
  IsNumberString,
  IsString,
  IsIn,
  IsISO8601,
} from 'class-validator';
import { ActTypeENUM, CategoryENUM } from '../activity.model';

export class UpdateActivityDTO {
  @IsOptional() @IsString() title: string;
  @IsOptional() @IsString() description: string;
  @IsOptional() @IsNumberString() amount: string;
  @IsOptional()
  @IsString()
  @IsIn(['EXPENDITURE', 'REVENUE', 'SAVINGS', 'INVESTMENT'])
  type: ActTypeENUM;
  @IsString()
  @IsOptional()
  @IsIn([
    'Automobile',
    'Shopping',
    'Salary',
    'Savings',
    'Investment',
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
