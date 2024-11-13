import { gql } from 'apollo-server-express';

export const vehicleSchema = gql`
  type Subscription {
    newMessage(room: String!): Message
  }
`;
