import { gql } from 'apollo-server-express';

export const notificationTypeDefs = gql`
  type Notification {
    userId: ID!
    message: String!
    timestamp: String!
  }

  type Subscription {
    notification(userId: ID!): Notification
  }
`;
