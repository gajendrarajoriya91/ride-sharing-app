import { gql } from 'apollo-server-express';

export const authSchema = gql`
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
    phone: String
    isDriver: Boolean
    isAdmin: Boolean
    isRider: Boolean
    isPhoneVerified: Boolean
    driverDetails: Driver # Only if the user is a driver
    createdAt: String
    updatedAt: String
  }

  type Driver {
    id: ID!
    user: User!
    licenseNumber: String!
    vehicle: Vehicle!
    rating: Float!
    ridesCompleted: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Vehicle {
    id: ID!
    make: String!
    model: String!
    year: Int!
    plateNumber: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    phone: String
    isDriver: Boolean!
    isAdmin: Boolean
    isRider: Boolean
    driverDetails: DriverInput # Optional, only if the user is a driver
  }

  input DriverInput {
    licenseNumber: String!
    vehicleType: String!
  }

  input VehicleInput {
    make: String!
    model: String!
    year: Int!
    plateNumber: String!
  }

  type Mutation {
    register(input: RegisterInput!): Response!
    login(input: LoginInput!): Response!
    logout: Response!
  }
`;
