import {
  Controller,
  UseFilters,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { BadRequestFilter } from 'src/exceptions/bad-request.filters';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { MongoFilter } from 'src/exceptions/mongo.filters';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
@UseFilters(BadRequestFilter, MongoFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 409,
    description:
      'This error will show when email provided already exists for a user',
  })
  @ApiResponse({ status: 201, description: 'User was successfully created' })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signup(createUserDTO);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async profile(@Request() req) {
    return this.authService.profile(req.user);
  }

  @Post('requestPasswordReset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('passwordReset')
  async passwordReset(@Body('password') pass: string, @Request() req) {
    const user = await this.authService.passwordReset(pass, req.user);

    if (!user) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'User cannot be found',
      });
    }
    const obj = { ...user._doc, id: user._doc._id };
    const { password, _id, accounts, ...data } = obj;

    return {
      statusCode: 200,
      message: 'Password reset successful',
      data,
    };
  }
}
