import { gql } from 'apollo-server-express';

export const bookingSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Booking {
    id: ID!
    user: User!
    ride: Ride!
    status: String!
    fare: Float!
    paymentStatus: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateBookingInput {
    ride: ID!
    status: String
    fare: Float!
    paymentStatus: String
  }

  input UpdateBookingInput {
    user: ID
    ride: ID
    status: String
    fare: Float
    paymentStatus: String
  }

  type Mutation {
    createBooking(input: CreateBookingInput!): Response!
    updateBooking(id: ID!, input: UpdateBookingInput!): Response!
    deleteBooking(id: ID!): Response!
  }

  type Query {
    getAllBookings: Response!
    getBooking(id: ID!): Response!
  }
`;
