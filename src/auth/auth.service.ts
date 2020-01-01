import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.model';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { MailerService } from '@nest-modules/mailer';
// import { LoginUserDTO } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
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

  async saltPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      return passwordHash;
    } catch (error) {
      throw new BadRequestException({ info: error });
    }
  }

  async signup(createUserDTO: CreateUserDTO): Promise<any> {
    const passwordHash = await this.saltPassword(createUserDTO.password);
    createUserDTO.password = passwordHash;
    const user = await this.usersService.create(createUserDTO);
    const loginDetails = await this.login(user);
    const obj = { ...user._doc, id: user._doc._id };
    const { password, _id, ...rest } = obj;
    await this.mailerService.sendMail({
      to: 'customer@somemailbox.com', // list of receivers
      from: 'noreply@xpenz.com', // sender address
      subject: 'Welcome to Xpenz', // Subject line
      template: `${process.env.mailtemplates_Dir}/welcome`, // The `.pug` or `.hbs` extension is appended automatically.
      context: {
        username: `${user.firstname} ${user.lastname}`,
      },
    });

    return {
      statusCode: 201,
      message: 'Signup request successful',
      data: { user: rest, token: loginDetails.data.token },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findUser(email);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Invalid email provided',
      });
    }

    const payload = { email, passwordResetToken: true, id: user.id };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '30mins' });

    await this.mailerService.sendMail({
      to: email, // list of receivers
      from: 'noreply@xpenz.com', // sender address
      subject: 'Password reset request', // Subject line
      template: `${process.env.mailtemplates_Dir}/password-reset`, // The `.pug` or `.hbs` extension is appended automatically.
      context: {
        resetToken,
        name: `${user.firstname} ${user.lastname}`,
      },
    });
    return {
      statusCode: 200,
      message:
        'Reset request successful, resetToken is valid for the next 30 minutes',
      data: { resetToken },
    };
  }

  async passwordReset(password: string, user: any) {
    if (!user.passwordResetToken) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Invalid token provided',
      });
    }
    const passwordHash = await this.saltPassword(password);
    return await this.usersService.changePassword(passwordHash, user.id);
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, sub: user.id };
    return {
      statusCode: 200,
      message: 'Login successful',
      data: { user, token: this.jwtService.sign(payload) },
    };
  }

  async profile(user: any) {
    const foundUser = await this.usersService.findUser(user.email);
    const obj = { ...foundUser._doc, id: foundUser._doc._id };
    const { password, _id, ...rest } = obj;
    return {
      statusCode: 200,
      message: 'Request successful',
      data: { user: rest },
    };
  }
}
