import { BookingService } from '../services/booking.service';
import { UserService } from '../services/user.service';
import { RideService } from '../services/ride.service';
import { IBooking } from '../models/booking.model';

const bookingService = new BookingService();
const userService = new UserService();
const rideService = new RideService();

const bookingResolver = {
  Query: {
    async getAllBookings(_: any, args: any, context: any) {
      try {
        if (!context.user || !context.user.isAdmin) {
          return {
            statusCode: 403,
            msg: 'Access denied - User is not an admin',
            data: null,
          };
        }
        const bookings = await bookingService.getAllBookings();
        return {
          statusCode: 200,
          msg: 'Bookings fetched successfully',
          data: bookings,
        };
      } catch (error) {
        console.error('Error fetching bookings:', error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch bookings',
          data: error,
        };
      }
    },

    async getBooking(_: any, { id }: { id: string }) {
      try {
        const booking = await bookingService.getBookingById(id);
        if (!booking) {
          return {
            statusCode: 404,
            msg: 'Booking not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Booking fetched successfully',
          data: booking,
        };
      } catch (error) {
        console.error(`Error fetching booking with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to fetch booking',
          data: error,
        };
      }
    },
  },

  Mutation: {
    async createBooking(
      _: any,
      { input }: { input: Partial<IBooking> },
      context: any,
    ) {
      try {
        const isDriver = context.user.isDriver;

        if (!isDriver) {
          return {
            statusCode: 400,
            msg: 'Only driver can accept rider booking',
            data: null,
          };
        }

        const { ride, status, fare, paymentStatus } = input;

        if (!fare || fare <= 0) {
          return {
            statusCode: 400,
            msg: 'Fare must be a positive number.',
            data: null,
          };
        }

        if (
          !status ||
          !['accepted', 'rejected', 'cancelled', 'completed'].includes(status)
        ) {
          return {
            statusCode: 400,
            msg: `Invalid booking status. Allowed values: 'accepted', 'rejected', 'cancelled', 'completed'.`,
            data: null,
          };
        }

        if (
          !paymentStatus ||
          !['unpaid', 'paid', 'refunded'].includes(paymentStatus)
        ) {
          return {
            statusCode: 400,
            msg: `Invalid payment status. Allowed values: 'unpaid', 'paid', 'refunded'.`,
            data: null,
          };
        }

        const rideData = await rideService.getRideById(ride as string);
        if (!rideData) {
          return {
            statusCode: 404,
            msg: 'Ride not found.',
            data: null,
          };
        }

        const user = rideData.user;
        input.user = user;
        console.log(input);

        const userData = await userService.getUserById(user as string);
        if (!userData) {
          return {
            statusCode: 404,
            msg: 'User not found.',
            data: null,
          };
        }

        if (
          rideData.status !== 'pending' &&
          rideData.status !== 'in-progress'
        ) {
          return {
            statusCode: 400,
            msg: 'Ride is not available for booking.',
            data: null,
          };
        }

        if (status === 'accepted') {
          await rideService.updateRideStatus(ride as string, 'in-progress');
        } else if (status === 'cancelled') {
          await rideService.updateRideStatus(ride as string, 'cancelled');
          return {
            statusCode: 201,
            msg: 'Ride has been successfully cancelled',
            data: { rideData },
          };
        }

        const booking = await bookingService.createBooking(input);
        return {
          statusCode: 201,
          msg: 'Booked successfully',
          data: { booking, rideData },
        };
      } catch (error) {
        console.error('Error creating booking:', error);
        return {
          statusCode: 500,
          msg: 'Failed to create booking',
          data: error,
        };
      }
    },

    async updateBooking(
      _: any,
      { id, input }: { id: string; input: Partial<IBooking> },
    ) {
      try {
        const updatedBooking = await bookingService.updateBooking(id, input);
        if (!updatedBooking) {
          return {
            statusCode: 404,
            msg: 'Booking not found',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Booking updated successfully',
          data: updatedBooking,
        };
      } catch (error) {
        console.error(`Error updating booking with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to update booking',
          data: error,
        };
      }
    },

    async deleteBooking(_: any, { id }: { id: string }) {
      try {
        const success = await bookingService.deleteBooking(id);
        if (!success) {
          return {
            statusCode: 404,
            msg: 'Booking not found or already deleted',
            data: null,
          };
        }
        return {
          statusCode: 200,
          msg: 'Booking deleted successfully',
          data: { success },
        };
      } catch (error) {
        console.error(`Error deleting booking with id ${id}:`, error);
        return {
          statusCode: 500,
          msg: 'Failed to delete booking',
          data: error,
        };
      }
    },
  },
};

export default bookingResolver;
