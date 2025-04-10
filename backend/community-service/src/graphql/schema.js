import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type CommunityPost {
    id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String!
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: User!
    description: String!
    location: String
    isResolved: Boolean!
    volunteers: [User]
    createdAt: String!
    updatedAt: String
  }

  input CommunityPostInput {
    title: String!
    content: String!
    category: String!
  }

  input HelpRequestInput {
    description: String!
    location: String
  }

  type Query {
    # Community Posts Queries
    getPosts(category: String): [CommunityPost]
    getPost(id: ID!): CommunityPost
    getPostsByUser(userId: ID!): [CommunityPost]
    
    # Help Requests Queries
    getHelpRequests(isResolved: Boolean): [HelpRequest]
    getHelpRequest(id: ID!): HelpRequest
    getHelpRequestsByUser(userId: ID!): [HelpRequest]
  }

  type Mutation {
    # Community Posts Mutations
    createPost(input: CommunityPostInput!): CommunityPost!
    updatePost(id: ID!, input: CommunityPostInput!): CommunityPost!
    deletePost(id: ID!): Boolean!
    generateAISummary(postId: ID!): CommunityPost!
    
    # Help Requests Mutations
    createHelpRequest(input: HelpRequestInput!): HelpRequest!
    updateHelpRequest(id: ID!, input: HelpRequestInput!): HelpRequest!
    resolveHelpRequest(id: ID!, isResolved: Boolean!): HelpRequest!
    deleteHelpRequest(id: ID!): Boolean!
    volunteerForHelp(helpRequestId: ID!): HelpRequest!
    withdrawFromHelp(helpRequestId: ID!): HelpRequest!
  }
`;

export default typeDefs;