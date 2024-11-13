import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';
import { IBooking } from './booking.model';
import { IPaymentMethod } from './payment.method.model';

export interface IPayment extends Document {
  user: IUser['_id'];
  booking: IBooking['_id'];
  amount: number;
  currency: string;
  paymentMethod: IPaymentMethod['_id'];
  status: 'pending' | 'paid' | 'unpaid' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'unpaid', 'refunded'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

paymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Payment = model<IPayment>('Payment', paymentSchema);
