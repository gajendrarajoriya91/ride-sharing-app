import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';
import { IVehicle } from './vehical.model';
import { IDriver } from './driver.model';

export interface IRide extends Document {
  driver: IDriver['_id'];
  vehicle: IVehicle['_id'];
  user: IUser['_id'];
  origin: {
    type: string;
    coordinates: [number, number];
  };
  destination: {
    type: string;
    coordinates: [number, number];
  };
  distance: number;
  estimatedTime: number;
  price: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const rideSchema = new Schema<IRide>({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  origin: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  destination: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  distance: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rideSchema.index({ origin: '2dsphere' });
rideSchema.index({ destination: '2dsphere' });

rideSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Ride = model<IRide>('Ride', rideSchema);
