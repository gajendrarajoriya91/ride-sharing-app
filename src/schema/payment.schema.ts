import { gql } from 'apollo-server-express';

export const paymentSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Payment {
    id: ID!
    user: User!
    booking: Booking!
    amount: Float!
    currency: String!
    paymentMethod: PaymentMethod!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePaymentInput {
    booking: ID!
    amount: Float!
    currency: String
    paymentMethod: ID!
    status: String
  }

  input UpdatePaymentInput {
    user: ID
    booking: ID
    amount: Float
    currency: String
    paymentMethod: ID
    status: String
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Response!
    updatePayment(id: ID!, input: UpdatePaymentInput!): Response!
    deletePayment(id: ID!): Response!
  }

  type Query {
    getAllPayments: Response!
    getPayment(id: ID!): Response!
  }
`;
