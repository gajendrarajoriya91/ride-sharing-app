import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';

export interface IPaymentMethod extends Document {
  user: IUser['_id'];
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string;
  last4Digits: string;
  expirationDate: Date;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],
    required: true,
  },
  provider: { type: String, required: true, trim: true },
  last4Digits: { type: String, required: true, minlength: 4, maxlength: 4 },
  expirationDate: { type: Date, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentMethodSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const PaymentMethod = model<IPaymentMethod>(
  'PaymentMethod',
  paymentMethodSchema,
);
