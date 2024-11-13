import { PaymentService } from '../services/payment.service';
import { BookingService } from '../services/booking.service';
import { IPayment } from '../models/payment.model';

const paymentService = new PaymentService();
const bookingService = new BookingService();

const paymentResolver = {
  Query: {
    async getAllPayments(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }
        const payments = await paymentService.getAllPayments();
        return {
          statusCode: 200,
          msg: 'Payments fetched successfully',
          data: payments,
        };
      } catch (error) {
        console.error('Error fetching payments:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch payments',
          data: error,
        };
      }
    },

    async getPayment(_: any, { id }: { id: string }) {
      try {
        const payment = await paymentService.getPaymentById(id);
        if (!payment) {
          return {
            statusCode: 404,
            msg: 'Payment not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment fetched successfully',
          data: payment,
        };
      } catch (error) {
        console.error(`Error fetching payment with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch payment',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createPayment(
      _: any,
      { input }: { input: Partial<IPayment> },
      context: any,
    ) {
      try {
        const { booking, amount, currency, paymentMethod, status } = input;
        input.user = context.user.id;

        const bookingExists = await bookingService.getBookingById(
          booking as string,
        );
        if (!bookingExists) {
          return {
            statusCode: 400,
            msg: 'Invalid booking ID.',
            data: null,
          };
        }

        const existingPayment = await paymentService.getPaymentByBookingId(
          booking as string,
        );
        if (existingPayment) {
          return {
            statusCode: 400,
            msg: 'A payment already exists for this booking.',
            data: null,
          };
        }

        const payment = await paymentService.createPayment(input);
        let paymentStatus: string | null = null;
        switch (status) {
          case 'paid':
            paymentStatus = 'paid';
            break;
          case 'unpaid':
            paymentStatus = 'unpaid';
            break;
          case 'refunded':
            paymentStatus = 'refunded';
            break;
          case 'pending':
            paymentStatus = 'pending';
            break;
          default:
            paymentStatus = null;
        }
        let bookingData;
        if (paymentStatus) {
          bookingData = await bookingService.updateBookingPaymentStatus(
            booking as string,
            paymentStatus,
          );
        }

        return {
          statusCode: 201,
          msg: 'Payment done successfully.',
          data: { payment, bookingData },
        };
      } catch (error) {
        console.error('Error creating payment:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create payment',
          data: error,
        };
      }
    },

    async updatePayment(
      _: any,
      { id, input }: { id: string; input: Partial<IPayment> },
    ) {
      try {
        const updatedPayment = await paymentService.updatePayment(id, input);
        if (!updatedPayment) {
          return {
            statusCode: 404,
            msg: 'Payment not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment updated successfully',
          data: updatedPayment,
        };
      } catch (error) {
        console.error(`Error updating payment with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update payment',
          data: error,
        };
      }
    },

    async deletePayment(_: any, { id }: { id: string }) {
      try {
        const success = await paymentService.deletePayment(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Payment not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Payment deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting payment with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete payment',
          data: error,
        };
      }
    },
  },
};

export default paymentResolver;
