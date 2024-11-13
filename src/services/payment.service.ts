import { Payment, IPayment } from '../models/payment.model';

export class PaymentService {
  // Get all payments
  async getAllPayments(): Promise<IPayment[]> {
    try {
      return await Payment.find();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }

  // Get a single payment by ID
  async getPaymentById(id: string): Promise<IPayment | null> {
    try {
      return await Payment.findById(id);
    } catch (error) {
      console.error(`Error fetching payment with id ${id}:`, error);
      throw new Error('Failed to fetch payment');
    }
  }

  // Create a new payment
  async createPayment(input: Partial<IPayment>): Promise<IPayment> {
    try {
      const newPayment = new Payment(input);
      return await newPayment.save();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  // Update an existing payment by ID
  async updatePayment(
    id: string,
    input: Partial<IPayment>,
  ): Promise<IPayment | null> {
    try {
      const payment = await this.getPaymentById(id);
      if (!payment) {
        return null;
      }

      return await Payment.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating payment with id ${id}:`, error);
      throw new Error('Failed to update payment');
    }
  }

  // Delete a payment by ID
  async deletePayment(id: string): Promise<boolean> {
    try {
      const result = await Payment.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting payment with id ${id}:`, error);
      throw new Error('Failed to delete payment');
    }
  }

  async getPaymentByBookingId(booking: string): Promise<IPayment | null> {
    try {
      return await Payment.findOne({ booking: booking });
    } catch (error) {
      console.error(
        `Error fetching payment with booking ID ${booking}:`,
        error,
      );
      throw new Error('Failed to fetch payment by booking ID');
    }
  }
}
