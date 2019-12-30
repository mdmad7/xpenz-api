import { Schema } from 'mongoose';

const ActivitySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      required: true,
      enum: ['EXPENDITURE', 'REVENUE'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Automobile',
        'Shopping',
        'Salary',
        'Savings',
        'Investment',
        'Food & Drinks',
        'Education',
        'Entertainment',
        'Furniture',
        'Gadget',
        'Gift',
        'Groceries',
        'Fitness',
        'Loan',
        'Medical',
        'Misc',
        'Housing',
        'Clothing',
        'Transport',
        'Travel',
        'Utilities',
      ],
    },
    amount: { type: Schema.Types.Decimal128 },
    owner: { type: Schema.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ActivitySchema.index({ title: 'text', description: 'text' });

ActivitySchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj._id;
  obj.amount = obj.amount.toString();
  return obj;
};

export { ActivitySchema };
