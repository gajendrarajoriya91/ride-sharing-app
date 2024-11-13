import { gql } from 'apollo-server-express';

export const vehicleSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Vehicle {
    id: ID!
    licenseNumber: String!
    vehicleType: String!
    make: String!
    cmodel: String!
    color: String!
    year: Int!
    capacity: Int!
    isAvailable: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateVehicleInput {
    licenseNumber: String!
    vehicleType: String!
    make: String
    cmodel: String
    color: String
    year: Int
    capacity: Int
    isAvailable: Boolean
  }

  input UpdateVehicleInput {
    licenseNumber: String
    make: String
    cmodel: String
    color: String
    year: Int
    capacity: Int
    isAvailable: Boolean
  }

  type Mutation {
    createVehicle(input: CreateVehicleInput!): Response!
    updateVehicle(id: ID!, input: UpdateVehicleInput!): Response!
    deleteVehicle(id: ID!): Response!
  }

  type Query {
    getAllVehicles: Response!
    getVehicle(id: ID!): Response!
  }
`;
