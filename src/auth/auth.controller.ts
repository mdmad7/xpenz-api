import {
  Controller,
  UseFilters,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BadRequestFilter } from 'src/exceptions/bad-request.filters';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { MongoFilter } from 'src/exceptions/mongo.filters';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UseFilters(BadRequestFilter, MongoFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signup(createUserDTO);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
