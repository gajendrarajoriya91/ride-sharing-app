import { gql } from 'apollo-server-express';

export const driverSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Driver {
    id: ID!
    user: User!
    licenseNumber: String!
    vehicle: Vehicle!
    rating: Float!
    ridesCompleted: Int!
    isLicenseNumberVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateDriverInput {
    user: ID!
    licenseNumber: String!
    vehicle: ID!
  }

  input VerifyLicenseNumberInput {
    licenseNumber: String!
  }

  input UpdateDriverInput {
    licenseNumber: String
    vehicleType: String!
    vehicle: ID
    rating: Float
    ridesCompleted: Int
  }

  type Mutation {
    createDriver(input: CreateDriverInput!): Response!
    updateDriver(id: ID!, input: UpdateDriverInput!): Response!
    deleteDriver(id: ID!): Response!
    verifyLicenseNumber(id: ID!, input: VerifyLicenseNumberInput): Response!
  }

  type Query {
    getAllDrivers: Response!
    getDriver(id: ID!): Response!
  }
`;
