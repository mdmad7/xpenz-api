import { UpdateAccountDTO } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { MongoFilter } from './../exceptions/mongo.filters';
import { BadRequestFilter } from './../exceptions/bad-request.filters';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UsersService } from './users.service';
import {
  Controller,
  Body,
  UseFilters,
  UseGuards,
  Request,
  Param,
  UnauthorizedException,
  NotFoundException,
  Patch,
  BadRequestException,
  Delete,
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
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Action could not be completed',
      });
    }

    return {
      statusCode: 200,
      message: 'Successful',
      data: data.accounts[data.accounts.length - 1],
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
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Action could not be completed',
      });
    }

    return {
      statusCode: 200,
      message: 'Successful',
      data: data.accounts.find(acc => acc.id === accountId),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/accounts/:accountId')
  async deleteAccount(
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

    const data = await this.usersService.deleteAccount(req.user, accountId);
    if (!data) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Action could not be completed',
      });
    }

    return {
      statusCode: 200,
      message: 'Successful',
    };
  }
}
