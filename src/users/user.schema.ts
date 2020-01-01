import { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

const AccountSchema = new Schema(
  {
    name: { type: String },
    starterAmount: { type: Schema.Types.Decimal128 },
    theme: { type: String, default: 'default' },
    type: {
      type: String,
      required: true,
      enum: ['DIGITAL WALLET', 'BANK', 'CREDIT CARD'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

AccountSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj._id;
  obj.starterAmount = obj.starterAmount.toString();
  return obj;
};

const UserSchema = new Schema(
  {
    avatar: {
      type: String,
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
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
      default: 'Unspecified',
      enum: ['Male', 'Female', 'Unspecified'],
    },
    accounts: {
      type: [AccountSchema],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

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
