import { PaymentMethod, IPaymentMethod } from '../models/payment.method.model';

export class PaymentMethodService {
  async getAllPaymentMethods(): Promise<IPaymentMethod[]> {
    try {
      return await PaymentMethod.find();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  async getPaymentMethodById(id: string): Promise<IPaymentMethod | null> {
    try {
      return await PaymentMethod.findById(id);
    } catch (error) {
      console.error(`Error fetching payment method with id ${id}:`, error);
      throw new Error('Failed to fetch payment method');
    }
  }

  async createPaymentMethod(
    input: Partial<IPaymentMethod>,
  ): Promise<IPaymentMethod> {
    try {
      const newPaymentMethod = new PaymentMethod(input);
      return await newPaymentMethod.save();
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Failed to create payment method');
    }
  }

  async updatePaymentMethod(
    id: string,
    input: Partial<IPaymentMethod>,
  ): Promise<IPaymentMethod | null> {
    try {
      const paymentMethod = await this.getPaymentMethodById(id);
      if (!paymentMethod) {
        return null;
      }

      return await PaymentMethod.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating payment method with id ${id}:`, error);
      throw new Error('Failed to update payment method');
    }
  }

  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      const result = await PaymentMethod.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting payment method with id ${id}:`, error);
      throw new Error('Failed to delete payment method');
    }
  }
}
