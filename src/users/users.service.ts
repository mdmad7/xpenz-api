import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findOne(email: string) {
    return await this.userModel.findOne(
      { email },
      { updatedAt: 0, createdAt: 0 },
    );
  }

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    const createdUser = new this.userModel(createUserDTO);
    return await createdUser.save();
  }
}
