import { gql } from 'apollo-server-express';

export const paymentMethodSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type PaymentMethod {
    id: ID!
    user: User!
    type: String!
    provider: String!
    last4Digits: String!
    expirationDate: String!
    isDefault: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePaymentMethodInput {
    user: ID!
    type: String!
    provider: String!
    last4Digits: String!
    expirationDate: String!
    isDefault: Boolean
  }

  input UpdatePaymentMethodInput {
    user: ID
    type: String
    provider: String
    last4Digits: String
    expirationDate: String
    isDefault: Boolean
  }

  type Mutation {
    createPaymentMethod(input: CreatePaymentMethodInput!): Response!
    updatePaymentMethod(id: ID!, input: UpdatePaymentMethodInput!): Response!
    deletePaymentMethod(id: ID!): Response!
  }

  type Query {
    getPaymentMethods: Response!
    getPaymentMethod(id: ID!): Response!
  }
`;
