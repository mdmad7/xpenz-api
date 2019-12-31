import { UpdateAccountDTO } from './dto/update-account.dto';
import { CreateAccountDTO } from './dto/create-account.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findOne(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email }, { password: 0 });
  }

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(createUserDTO.password, salt);
      createUserDTO.password = passwordHash;
    } catch (error) {
      throw new BadRequestException({ info: error });
    }
    const createdUser = new this.userModel(createUserDTO);
    return await createdUser.save();
  }

  async createAccount(createAccountDTO: CreateAccountDTO, user: any) {
    const theOne = await this.userModel.findById({ _id: user.id });
    if (theOne.accounts.length >= 10) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad request',
        message: 'Accounts limit exceeded',
      });
    }

    theOne.accounts.push(createAccountDTO);
    const updated = await theOne.save();
    return updated;
  }

  async updateAccount(
    updateAccountDto: UpdateAccountDTO,
    user: any,
    accountId: string,
  ) {
    const setObj = Object.keys(updateAccountDto).reduce((acc, cur) => {
      acc[`accounts.$.${cur}`] = updateAccountDto[cur];
      return acc;
    }, {});

    return await this.userModel.findOneAndUpdate(
      {
        _id: user.id,
        'accounts._id': accountId,
      },
      {
        $set: { ...setObj },
      },
      { new: true },
    );
  }

  async deleteAccount(user: any, accountId: string) {
    const theOne = await this.userModel.findById({ _id: user.id });
    try {
      theOne.accounts.id(accountId).remove();
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'Not found',
        message: 'Requested account not found',
      });
    }
    const updated = await theOne.save();
    return updated;
  }
}
