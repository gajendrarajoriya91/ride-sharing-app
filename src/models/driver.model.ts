import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser, User } from './user.model';
import { IVehicle } from './vehical.model';

export interface IDriver extends Document {
  user: IUser['_id'];
  licenseNumber: string;
  vehicle: IVehicle['_id'];
  rating: number;
  ridesCompleted: number;
  isLicenseNumberVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const driverSchema = new Schema<IDriver>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, default: 5.0 },
  ridesCompleted: { type: Number, default: 0 },
  isLicenseNumberVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

driverSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Driver = model<IDriver>('Driver', driverSchema);
