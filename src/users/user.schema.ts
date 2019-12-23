import { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unspecified'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

UserSchema.pre('save', async function savePassword() {
  if (this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);
      this.password = passwordHash;
    } catch (error) {
      throw new BadRequestException({ info: error });
    }
  } else {
    return false;
  }
});

UserSchema.methods.isValidPassword = async function comparePassword(
  newPassword,
) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new UnauthorizedException({ info: error });
  }
};

export { UserSchema };
