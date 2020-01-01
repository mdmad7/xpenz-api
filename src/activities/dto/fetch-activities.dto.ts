import { CategoryENUM, ActTypeENUM } from './../activity.model';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsISO8601,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FetchActivitiesDTO {
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
    description: 'For pagination. The current page to fetch activities from',
  })
  @IsOptional()
  @IsNumberString()
  page: string;
  @ApiPropertyOptional({
    type: Number,
    example: 50,
    default: 100,
    description:
      'For pagination. The size of activities fetched from the current page',
  })
  @IsOptional()
  @IsNumberString()
  size: string;
  @ApiPropertyOptional({
    example: 'star wars',
    description:
      'Search string for finding activities. ND: Searches only the description and title fields',
  })
  @IsOptional()
  @IsString()
  search: string;
  @ApiPropertyOptional({
    example: 'WALLET',
    description:
      'Filter. Filter activities based on account the activity was made on.',
  })
  @IsOptional()
  @IsString()
  account: string;
  @ApiPropertyOptional({
    example: 'Food & Drinks',
    description: 'Filter. Will filter down activities based on passed category',
    enum: CategoryENUM,
  })
  @IsOptional()
  @IsString()
  category: CategoryENUM;
  @ApiPropertyOptional({
    example: '2019-10-28',
    description:
      'Filter. Will filter down activities limited to the day of date provided, Unless otherwise specified in the dateType field',
  })
  @IsOptional()
  @IsISO8601()
  @IsString()
  date: string;
  @ApiPropertyOptional({
    example: 'EXPENDITURE',
    enum: ActTypeENUM,
    description: 'Filter. Will filter down activities based on activity type',
  })
  @IsOptional()
  @IsString()
  type: ActTypeENUM;
  @ApiPropertyOptional({
    example: 'day',
    default: 'day',
    enum: ['day', 'month', 'year'],
    description:
      'When provided, will limit the date param to either day, month, or year',
  })
  @IsOptional()
  @IsString()
  @IsIn(['day', 'month', 'year'])
  dateType: string;
}
