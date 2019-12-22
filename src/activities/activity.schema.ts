import * as mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      required: true,
      enum: ['EXPENDITURE', 'REVENUE', 'SAVING', 'INVESTMENT'],
    },
    amount: { type: mongoose.Schema.Types.Decimal128 },
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
