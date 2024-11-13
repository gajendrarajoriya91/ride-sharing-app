import { gql } from 'apollo-server-express';

export const messageSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Message {
    id: ID!
    sender: User!
    receiver: User!
    ride: Ride
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateMessageInput {
    receiver: ID!
    ride: ID
    content: String!
  }

  input UpdateMessageInput {
    sender: ID
    receiver: ID
    ride: ID
    content: String
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Response!
    updateMessage(id: ID!, input: UpdateMessageInput!): Response!
    deleteMessage(id: ID!): Response!
  }

  type Query {
    getMessages: Response!
    getMessage(id: ID!): Response!
  }
`;
