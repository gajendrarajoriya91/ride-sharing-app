import authResolver from './auth.resolver';
import userResolver from './user.resolver';
import vehicleResolver from './vehicle.resolver';
import rideResolver from './ride.resolver';
import paymentResolver from './payment.resolver';
import paymentMethodResolver from './payment.method.resolver';
import messageResolver from './message.resolver';
import driverResolver from './driver.resolver';
import bookingResolver from './booking.resolver';

export const resolvers = [
  authResolver,
  userResolver,
  vehicleResolver,
  rideResolver,
  paymentMethodResolver,
  paymentResolver,
  messageResolver,
  driverResolver,
  bookingResolver,
];
