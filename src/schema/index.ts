import { authSchema } from './auth.schema';
import { userSchema } from './user.schema';
import { driverSchema } from './driver.schema';
import { rideSchema } from './ride.schema';
import { paymentSchema } from './payment.schema';
import { paymentMethodSchema } from './payment.method.schema';
import { vehicleSchema } from './vehicle.schema';
import { messageSchema } from './message.schema';
import { bookingSchema } from './booking.schema';
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    _empty: String
  }

  ${authSchema}
  ${userSchema}
  ${driverSchema}
  ${rideSchema}
  ${paymentSchema}
  ${paymentMethodSchema}
  ${vehicleSchema}
  ${messageSchema}
  ${bookingSchema}
`;
