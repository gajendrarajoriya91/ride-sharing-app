import { Message, IMessage } from '../models/message.model';

export class MessageService {
  async getMessagesByRideId(rideId: string): Promise<IMessage[]> {
    try {
      return await Message.find({ ride: rideId })
        .populate('sender', 'name email')
        .populate('receiver', 'name email')
        .sort({ createdAt: 1 });
    } catch (error) {
      console.error(`Error fetching messages for ride ${rideId}:`, error);
      throw new Error('Failed to fetch messages');
    }
  }

  async getMessageById(id: string): Promise<IMessage | null> {
    try {
      return await Message.findById(id)
        .populate('sender', 'name email')
        .populate('receiver', 'name email');
    } catch (error) {
      console.error(`Error fetching message with id ${id}:`, error);
      throw new Error('Failed to fetch message');
    }
  }

  async createMessage(input: Partial<IMessage>): Promise<IMessage> {
    try {
      const newMessage = new Message(input);
      return await newMessage.save();
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  }

  async updateMessage(
    id: string,
    input: Partial<IMessage>,
  ): Promise<IMessage | null> {
    try {
      const message = await this.getMessageById(id);
      if (!message) {
        return null;
      }
      return await Message.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating message with id ${id}:`, error);
      throw new Error('Failed to update message');
    }
  }

  async deleteMessage(id: string): Promise<boolean> {
    try {
      const result = await Message.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting message with id ${id}:`, error);
      throw new Error('Failed to delete message');
    }
  }
}
