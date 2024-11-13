import { PaymentMethodService } from '../services/payment.method.service';
import { IPaymentMethod } from '../models/payment.method.model';
import { UserService } from '../services/user.service';

const paymentMethodService = new PaymentMethodService();
const userService = new UserService();

const paymentMethodResolver = {
  Query: {
    async getPaymentMethods(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }

        const paymentMethods =
          await paymentMethodService.getAllPaymentMethods();
        return {
          statusCode: 200,
          msg: 'Payment methods fetched successfully',
          data: paymentMethods,
        };
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch payment methods',
          data: error,
        };
      }
    },

    async getPaymentMethod(_: any, { id }: { id: string }) {
      try {
        const paymentMethod =
          await paymentMethodService.getPaymentMethodById(id);
        if (!paymentMethod) {
          return {
            statusCode: 404,
            msg: 'Payment method not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment method fetched successfully',
          data: paymentMethod,
        };
      } catch (error) {
        console.error(`Error fetching payment method with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch payment method',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createPaymentMethod(
      _: any,
      { input }: { input: Partial<IPaymentMethod> },
      context: any,
    ) {
      try {
        const { user } = input;

        const userData = await userService.getUserById(user as string);

        if (!userData) {
          return {
            statusCode: 404,
            msg: 'User not found',
            data: null,
          };
        }

        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Unauthorized: Only admins can create payment methods',
            data: null,
          };
        }

        const paymentMethod =
          await paymentMethodService.createPaymentMethod(input);
        return {
          statusCode: 201,
          msg: 'Payment method created successfully',
          data: paymentMethod,
        };
      } catch (error) {
        console.error('Error creating payment method:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create payment method',
          data: error,
        };
      }
    },

    async updatePaymentMethod(
      _: any,
      { id, input }: { id: string; input: Partial<IPaymentMethod> },
      context: any,
    ) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Unauthorized: Only admins can update payment methods',
            data: null,
          };
        }
        const updatedPaymentMethod =
          await paymentMethodService.updatePaymentMethod(id, input);
        if (!updatedPaymentMethod) {
          return {
            statusCode: 404,
            msg: 'Payment method not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment method updated successfully',
          data: updatedPaymentMethod,
        };
      } catch (error) {
        console.error(`Error updating payment method with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update payment method',
          data: error,
        };
      }
    },

    async deletePaymentMethod(_: any, { id }: { id: string }, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Unauthorized: Only admins can delete payment methods',
            data: null,
          };
        }

        const success = await paymentMethodService.deletePaymentMethod(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Payment method not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment method deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting payment method with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete payment method',
          data: error,
        };
      }
    },
  },
};

export default paymentMethodResolver;
