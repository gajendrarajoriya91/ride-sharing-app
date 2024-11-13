import { MessageService } from '../services/message.service';
import { IMessage } from '../models/message.model';

const messageService = new MessageService();

const messageResolver = {
  Query: {
    async getMessages(_: any, { ride }: { ride: string }) {
      try {
        const messages = await messageService.getMessagesByRideId(ride);
        return {
          statusCode: 200,
          msg: 'Messages fetched successfully',
          data: messages,
        };
      } catch (error) {
        console.error('Error fetching messages:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch messages',
          data: error,
        };
      }
    },

    async getMessage(_: any, { id }: { id: string }) {
      try {
        const message = await messageService.getMessageById(id);
        if (!message) {
          return {
            statusCode: 404,
            msg: 'Message not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Message fetched successfully',
          data: message,
        };
      } catch (error) {
        console.error(`Error fetching message with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch message',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createMessage(
      _: any,
      { input }: { input: Partial<IMessage> },
      context: any,
    ) {
      try {
        input.sender = context.user.id;

        const message = await messageService.createMessage(input);

        if (message.ride) {
          context.io.to(message.ride.toString()).emit('newMessage', message);
        }

        return {
          statusCode: 201,
          msg: 'Message created successfully',
          data: message,
        };
      } catch (error) {
        console.error('Error creating message:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create message',
          data: error,
        };
      }
    },

    async updateMessage(
      _: any,
      { id, input }: { id: string; input: Partial<IMessage> },
      context: any,
    ) {
      try {
        const updatedMessage = await messageService.updateMessage(id, input);
        if (!updatedMessage) {
          return {
            statusCode: 404,
            msg: 'Message not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Message updated successfully',
          data: updatedMessage,
        };
      } catch (error) {
        console.error(`Error updating message with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update message',
          data: error,
        };
      }
    },

    async deleteMessage(_: any, { id }: { id: string }) {
      try {
        const success = await messageService.deleteMessage(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Message not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Message deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting message with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete message',
          data: error,
        };
      }
    },
  },
};

export default messageResolver;
