import mongoose, { Document, Schema, model } from 'mongoose';
import { IUser } from './user.model';
import { IRide } from './ride.model';

export interface IMessage extends Document {
  sender: IUser['_id'];
  receiver: IUser['_id'];
  ride?: IRide['_id'];
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Message = model<IMessage>('Message', messageSchema);
