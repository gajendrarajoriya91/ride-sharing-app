import mongoose, { Document, Schema, model } from 'mongoose';

export interface IVehicle extends Document {
  licenseNumber: string;
  vehicleType: 'cab' | 'auto' | 'bike';
  make: string;
  cmodel: string;
  color: string;
  year: number;
  capacity: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const vehicleSchema = new Schema<IVehicle>({
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  vehicleType: {
    type: String,
    enum: ['cab', 'auto', 'bike'],
    required: true,
  },
  make: { type: String },
  cmodel: { type: String },
  color: { type: String },
  year: { type: Number },
  capacity: { type: Number, min: 1 },
  isAvailable: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

vehicleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
