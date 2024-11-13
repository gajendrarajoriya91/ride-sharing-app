import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isDriver: boolean;
  isAdmin: boolean;
  isRider: boolean;
  isPhoneVerified: boolean;
  driverDetails?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, required: true, unique: true, trim: true },
  isRider: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isDriver: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  driverDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = model<IUser>('User', userSchema);
