import { gql } from '@apollo/client';

// Community Posts Queries
export const GET_POSTS = gql`
  query GetPosts($category: String) {
    getPosts(category: $category) {
      id
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
    }
  }
`;

export const GET_POSTS_BY_USER = gql`
  query GetPostsByUser($userId: ID!) {
    getPostsByUser(userId: $userId) {
      id
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
    }
  }
`;

// Help Requests Queries
export const GET_HELP_REQUESTS = gql`
  query GetHelpRequests($isResolved: Boolean) {
    getHelpRequests(isResolved: $isResolved) {
      id
      description
      location
      isResolved
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
      volunteers {
        id
        username
        role
      }
    }
  }
`;

export const GET_HELP_REQUEST = gql`
  query GetHelpRequest($id: ID!) {
    getHelpRequest(id: $id) {
      id
      description
      location
      isResolved
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
      volunteers {
        id
        username
        role
      }
    }
  }
`;

export const GET_HELP_REQUESTS_BY_USER = gql`
  query GetHelpRequestsByUser($userId: ID!) {
    getHelpRequestsByUser(userId: $userId) {
      id
      description
      location
      isResolved
      createdAt
      updatedAt
      author {
        id
        username
        role
      }
      volunteers {
        id
        username
        role
      }
    }
  }
`;