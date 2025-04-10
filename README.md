# Community Engagement System

A community engagement system built with micro-frontends and microservices architecture using GraphQL for communication.

## Project Structure

```
community-engagement-system/
├── backend/
│   ├── auth-service/         # User Authentication Microservice
│   │   ├── src/
│   │   │   ├── models/       # MongoDB schemas
│   │   │   ├── graphql/      # GraphQL schemas and resolvers
│   │   │   ├── utils/        # Utility functions
│   │   │   └── index.js      # Entry point
│   │   ├── package.json
│   │   └── .env              # Environment variables
│   │
│   └── community-service/    # Community Engagement Microservice
│       ├── src/
│       │   ├── models/       # MongoDB schemas
│       │   ├── graphql/      # GraphQL schemas and resolvers
│       │   ├── utils/        # Utility functions
│       │   └── index.js      # Entry point
│       ├── package.json
│       └── .env              # Environment variables
│
├── frontend/
│   ├── host-app/             # Main application shell
│   │   ├── src/
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   ├── auth-app/             # Authentication Micro Frontend
│   │   ├── src/
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── community-app/        # Community Engagement Micro Frontend
│       ├── src/
│       ├── vite.config.js
│       └── package.json
│
└── package.json              # Root package.json for scripts
```

## Technologies Used

### Backend
- Express.js - Web server framework
- Apollo Server - GraphQL server
- MongoDB - Database
- Mongoose - MongoDB ODM
- JWT - Authentication

### Frontend
- React - UI library
- Vite - Build tool
- Module Federation - Micro-frontend architecture
- Apollo Client - GraphQL client
- React Bootstrap - UI components
- Formik & Yup - Form handling and validation

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd community-engagement-system
```

2. Install dependencies:
```bash
npm install
npm run install:all
```

3. Configure environment variables:
   - Update the `.env` files in both microservices with your MongoDB connection strings and JWT secret

4. Start the backend services:
```bash
npm run start:backend
```

5. Start the frontend applications:
```bash
npm run start:frontend
```

6. Access the application:
   - Host App: http://localhost:5000
   - Auth App: http://localhost:5001
   - Community App: http://localhost:5002

## Features

### User Authentication
- User registration with role selection
- User login/logout
- JWT-based authentication

### Community Engagement
- News posting and viewing
- Community discussions
- Help requests with volunteer system
- AI-generated summaries for long posts

## User Roles

- **Resident**: Regular community member
- **Business Owner**: Local business representative
- **Community Organizer**: Community leader with additional privileges

## API Documentation

### Auth Service (http://localhost:4001/graphql)
- Mutations:
  - `signup`: Register a new user
  - `login`: Authenticate a user
  - `logout`: Log out a user

- Queries:
  - `me`: Get the current authenticated user
  - `getUser`: Get a user by ID
  - `getUsers`: Get all users

### Community Service (http://localhost:4002/graphql)
- Mutations:
  - `createPost`: Create a new community post
  - `updatePost`: Update an existing post
  - `deletePost`: Delete a post
  - `generateAISummary`: Generate an AI summary for a post
  - `createHelpRequest`: Create a new help request
  - `updateHelpRequest`: Update an existing help request
  - `resolveHelpRequest`: Mark a help request as resolved/unresolved
  - `deleteHelpRequest`: Delete a help request
  - `volunteerForHelp`: Volunteer for a help request
  - `withdrawFromHelp`: Withdraw from a help request

- Queries:
  - `getPosts`: Get community posts (filtered by category)
  - `getPost`: Get a post by ID
  - `getPostsByUser`: Get posts by a specific user
  - `getHelpRequests`: Get help requests (filtered by resolved status)
  - `getHelpRequest`: Get a help request by ID
  - `getHelpRequestsByUser`: Get help requests by a specific user