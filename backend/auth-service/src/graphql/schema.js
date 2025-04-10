import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # User type definition
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
    lastLogin: String
    loginAttempts: Int
    loginBlockedUntil: String
  }

  # Authentication payload
  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  # Token refresh payload
  type RefreshTokenPayload {
    accessToken: String!
    refreshToken: String!
  }

  # Query type
  type Query {
    # Get the currently authenticated user
    getCurrentUser: User

    # Get a user by ID (admin only)
    getUserById(id: ID!): User

    # Get company information (placeholder)
    company: CompanyInfo

    # Get roadster information (placeholder)
    roadster: RoadsterInfo
  }

  # Company information type (placeholder)
  type CompanyInfo {
    name: String
    founder: String
    founded: Int
    employees: Int
    vehicles: Int
  }

  # Roadster information type (placeholder)
  type RoadsterInfo {
    name: String
    launchDate: String
    speed: Float
    earthDistance: Float
    marsDistance: Float
  }

  # Mutation type
  type Mutation {
    # User registration
    register(
      username: String!
      email: String!
      password: String!
      role: String
    ): AuthPayload!

    # User login
    login(
      username: String!
      password: String!
    ): AuthPayload!

    # Refresh access token
    refreshToken(
      refreshToken: String!
    ): RefreshTokenPayload!

    # User logout
    logout(
      refreshToken: String!
    ): Boolean!

    # Update user profile
    updateUser(
      id: ID!
      username: String
      email: String
      role: String
    ): User

    # Delete user account
    deleteUser(id: ID!): Boolean!
  }
`;

export default typeDefs;