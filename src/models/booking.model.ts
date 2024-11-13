import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';
import { IRide } from './ride.model';

export interface IBooking extends Document {
  user: IUser['_id'];
  ride: IRide['_id'];
  status: 'accepted' | 'rejected' | 'cancelled' | 'completed';
  fare: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'cancelled', 'completed'],
    default: 'accepted',
  },
  fare: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'pending'],
    default: 'unpaid',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Booking = model<IBooking>('Booking', bookingSchema);
