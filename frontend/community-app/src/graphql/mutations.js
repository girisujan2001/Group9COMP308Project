import { gql } from '@apollo/client';

// Community Posts Mutations
export const CREATE_POST = gql`
  mutation CreatePost($input: CommunityPostInput!) {
    createPost(input: $input) {
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

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: CommunityPostInput!) {
    updatePost(id: $id, input: $input) {
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

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const GENERATE_AI_SUMMARY = gql`
  mutation GenerateAISummary($postId: ID!) {
    generateAISummary(postId: $postId) {
      id
      aiSummary
    }
  }
`;

// Help Requests Mutations
export const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($input: HelpRequestInput!) {
    createHelpRequest(input: $input) {
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

export const UPDATE_HELP_REQUEST = gql`
  mutation UpdateHelpRequest($id: ID!, $input: HelpRequestInput!) {
    updateHelpRequest(id: $id, input: $input) {
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

export const RESOLVE_HELP_REQUEST = gql`
  mutation ResolveHelpRequest($id: ID!, $isResolved: Boolean!) {
    resolveHelpRequest(id: $id, isResolved: $isResolved) {
      id
      isResolved
      updatedAt
    }
  }
`;

export const DELETE_HELP_REQUEST = gql`
  mutation DeleteHelpRequest($id: ID!) {
    deleteHelpRequest(id: $id)
  }
`;

export const VOLUNTEER_FOR_HELP = gql`
  mutation VolunteerForHelp($helpRequestId: ID!) {
    volunteerForHelp(helpRequestId: $helpRequestId) {
      id
      volunteers {
        id
        username
        role
      }
    }
  }
`;

export const WITHDRAW_FROM_HELP = gql`
  mutation WithdrawFromHelp($helpRequestId: ID!) {
    withdrawFromHelp(helpRequestId: $helpRequestId) {
      id
      volunteers {
        id
        username
        role
      }
    }
  }
`;