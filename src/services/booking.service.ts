import { Booking, IBooking } from '../models/booking.model';

export class BookingService {
  async getAllBookings(): Promise<IBooking[]> {
    try {
      return await Booking.find();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    try {
      return await Booking.findById(id);
    } catch (error) {
      console.error(`Error fetching booking with id ${id}:`, error);
      throw new Error('Failed to fetch booking');
    }
  }

  async createBooking(input: Partial<IBooking>): Promise<IBooking> {
    try {
      const newBooking = new Booking(input);
      return await newBooking.save();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  }

  async updateBooking(
    id: string,
    input: Partial<IBooking>,
  ): Promise<IBooking | null> {
    try {
      const booking = await this.getBookingById(id);
      if (!booking) {
        return null;
      }

      return await Booking.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      console.error(`Error updating booking with id ${id}:`, error);
      throw new Error('Failed to update booking');
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const result = await Booking.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting booking with id ${id}:`, error);
      throw new Error('Failed to delete booking');
    }
  }

  async updateBookingPaymentStatus(
    id: string,
    paymentStatus: string,
  ): Promise<IBooking | null> {
    try {
      const booking = await this.getBookingById(id);
      if (!booking) {
        return null;
      }

      return await Booking.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true },
      );
    } catch (error) {
      console.error(`Error updating booking status with id ${id}:`, error);
      throw new Error('Failed to update booking status');
    }
  }
}
