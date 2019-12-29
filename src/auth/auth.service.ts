import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.model';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
// import { LoginUserDTO } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const isMatch = user ? await user.isValidPassword(pass) : false;

    if (user && isMatch) {
      return user;
    }

    throw new UnauthorizedException({
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Invalid email or password provided',
    });
  }

  async signup(createUserDTO: CreateUserDTO): Promise<any> {
    const user = await this.usersService.create(createUserDTO);
    const obj = { ...user._doc, id: user._doc._id };
    const { password, _id, ...rest } = obj;
    return rest;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, sub: user.id };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async profile(user: any) {
    const foundUser = await this.usersService.findUser(user.email);
    const obj = { ...foundUser._doc, id: foundUser._doc._id };
    const { password, _id, ...rest } = obj;
    return rest;
  }
}
