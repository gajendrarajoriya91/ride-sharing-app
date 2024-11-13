import { gql } from 'apollo-server-express';
//src/shema/user.schema.ts

export const userSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    isDriver: Boolean!
    driverDetails: Driver
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    phone: String!
    isDriver: Boolean
    driverDetails: ID
  }

  input UpdateUserInput {
    name: String
    email: String
    phone: String
    driverDetails: ID
  }

  type Query {
    getAllUsers: Response!
    getUser: Response!
  }

  type Mutation {
    createUser(input: CreateUserInput!): Response!
    updateUser(input: UpdateUserInput!): Response!
    deleteUser: Response!
  }
`;
