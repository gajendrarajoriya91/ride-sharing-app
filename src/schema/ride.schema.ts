import { gql } from 'apollo-server-express';

export const rideSchema = gql`
  scalar JSON

  type Response {
    statusCode: Int!
    msg: String!
    data: JSON
  }

  type Ride {
    id: ID!
    driver: Driver!
    vehicle: Vehicle!
    user: User!
    origin: Location!
    destination: Location!
    distance: Float!
    estimatedTime: Int!
    price: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    type: String!
    coordinates: [Float!]!
  }

  input LocationInput {
    type: String! # Should always be "Point"
    coordinates: [Float!]! # Longitude and Latitude
  }

  input CreateRideInput {
    driver: ID!
    origin: LocationInput!
    destination: LocationInput!
    distance: Float!
    estimatedTime: Int!
    price: Float!
    status: String
  }

  input UpdateRideInput {
    driver: ID
    vehicle: ID
    origin: LocationInput
    destination: LocationInput
    distance: Float
    estimatedTime: Int
    price: Float
  }

  type Mutation {
    createRide(input: CreateRideInput!): Response!
    updateRide(id: ID!, input: UpdateRideInput!): Response!
    deleteRide(id: ID!): Response!
  }

  type Query {
    getAllRides: Response!
    getRide(id: ID!): Response!
  }
`;
