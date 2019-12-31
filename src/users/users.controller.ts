import { UpdateAccountDTO } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { MongoFilter } from './../exceptions/mongo.filters';
import { BadRequestFilter } from './../exceptions/bad-request.filters';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UsersService } from './users.service';
import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Request,
  Param,
  UnauthorizedException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { MongoIdDTO } from 'src/activities/dto/mongo-id.dto';

@Controller('users')
@UseFilters(BadRequestFilter, MongoFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/accounts')
  async createAccount(
    @Body() createAccountDto: CreateAccountDTO,
    @Request() req,
    @Param() mongoIdDTO: MongoIdDTO,
  ) {
    if (req.user.id !== mongoIdDTO.id) {
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: `User id mismatch`,
      });
    }

    const data = await this.usersService.createAccount(
      createAccountDto,
      req.user,
    );

    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found',
      });
    }

    return {
      statusCode: 200,
      message: 'Successful',
      data: data.accounts,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/accounts/:accountId')
  async updateAccount(
    @Body() updateAccountDto: UpdateAccountDTO,
    @Request() req,
    @Param('id') id,
    @Param('accountId') accountId,
  ) {
    if (req.user.id !== id) {
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: `User id mismatch`,
      });
    }

    const data = await this.usersService.updateAccount(
      updateAccountDto,
      req.user,
      accountId,
    );

    if (!data) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Not Found',
        message: 'User not found',
      });
    }

    return {
      statusCode: 200,
      message: 'Successful',
      data: data.accounts,
    };
  }
}
