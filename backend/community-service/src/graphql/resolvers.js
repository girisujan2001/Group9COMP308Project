import mongoose from 'mongoose';
import CommunityPost from '../models/CommunityPost.js';
import HelpRequest from '../models/HelpRequest.js';

const resolvers = {
  Query: {
    // Community Posts Queries
    getPosts: async (_, { category }) => {
      const filter = category ? { category } : {};
      return await CommunityPost.find(filter).sort({ createdAt: -1 });
    },
    
    getPost: async (_, { id }) => {
      return await CommunityPost.findById(id);
    },
    
    getPostsByUser: async (_, { userId }) => {
      return await CommunityPost.find({ author: userId }).sort({ createdAt: -1 });
    },
    
    // Help Requests Queries
    getHelpRequests: async (_, { isResolved }) => {
      const filter = isResolved !== undefined ? { isResolved } : {};
      return await HelpRequest.find(filter).sort({ createdAt: -1 });
    },
    
    getHelpRequest: async (_, { id }) => {
      return await HelpRequest.findById(id);
    },
    
    getHelpRequestsByUser: async (_, { userId }) => {
      return await HelpRequest.find({ author: userId }).sort({ createdAt: -1 });
    }
  },
  
  Mutation: {
    // Community Posts Mutations
    createPost: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const newPost = new CommunityPost({
        ...input,
        author: user.id
      });
      
      return await newPost.save();
    },
    
    updatePost: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const post = await CommunityPost.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Check if user is the author
      if (post.author.toString() !== user.id) {
        throw new Error('Not authorized to update this post');
      }
      
      // Update the post
      Object.assign(post, input);
      post.updatedAt = new Date();
      
      return await post.save();
    },
    
    deletePost: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const post = await CommunityPost.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Check if user is the author or has admin role
      if (post.author.toString() !== user.id && user.role !== 'community_organizer') {
        throw new Error('Not authorized to delete this post');
      }
      
      await post.deleteOne();
      return true;
    },
    
    generateAISummary: async (_, { postId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const post = await CommunityPost.findById(postId);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // In a real application, this would call an AI service
      // For now, we'll just create a simple summary
      post.aiSummary = `AI Summary of: ${post.title}`;
      post.updatedAt = new Date();
      
      return await post.save();
    },
    
    // Help Requests Mutations
    createHelpRequest: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const newHelpRequest = new HelpRequest({
        ...input,
        author: user.id
      });
      
      return await newHelpRequest.save();
    },
    
    updateHelpRequest: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const helpRequest = await HelpRequest.findById(id);
      
      if (!helpRequest) {
        throw new Error('Help request not found');
      }
      
      // Check if user is the author
      if (helpRequest.author.toString() !== user.id) {
        throw new Error('Not authorized to update this help request');
      }
      
      // Update the help request
      Object.assign(helpRequest, input);
      helpRequest.updatedAt = new Date();
      
      return await helpRequest.save();
    },
    
    resolveHelpRequest: async (_, { id, isResolved }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      console.log('Resolving help request:', {
        id,
        isResolved,
        userId: user.id,
        userRole: user.role
      });
      
      const helpRequest = await HelpRequest.findById(id);
      
      if (!helpRequest) {
        console.error('Help request not found:', { id });
        throw new Error('Help request not found');
      }
      
      console.log('Found help request:', {
        helpRequestAuthor: helpRequest.author.toString(),
        currentIsResolved: helpRequest.isResolved
      });
      
      // Check if user is the author or a community organizer
      if (helpRequest.author.toString() !== user.id && user.role !== 'community_organizer') {
        console.error('Not authorized to resolve this help request', {
          helpRequestAuthor: helpRequest.author.toString(),
          userId: user.id,
          userRole: user.role
        });
        throw new Error('Not authorized to resolve this help request');
      }
      
      helpRequest.isResolved = isResolved;
      helpRequest.updatedAt = new Date();
      
      try {
        const savedHelpRequest = await helpRequest.save();
        console.log('Help request resolved successfully:', {
          id: savedHelpRequest.id,
          isResolved: savedHelpRequest.isResolved
        });
        return savedHelpRequest;
      } catch (error) {
        console.error('Error saving help request:', error);
        throw new Error('Failed to save help request');
      }
    },
    
    deleteHelpRequest: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const helpRequest = await HelpRequest.findById(id);
      
      if (!helpRequest) {
        throw new Error('Help request not found');
      }
      
      // Check if user is the author or has admin role
      if (helpRequest.author.toString() !== user.id && user.role !== 'community_organizer') {
        throw new Error('Not authorized to delete this help request');
      }
      
      await helpRequest.deleteOne();
      return true;
    },
    
    volunteerForHelp: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const helpRequest = await HelpRequest.findById(helpRequestId);
      
      if (!helpRequest) {
        throw new Error('Help request not found');
      }
      
      // Check if user is already a volunteer
      if (helpRequest.volunteers.includes(user.id)) {
        throw new Error('You are already volunteering for this help request');
      }
      
      // Add user to volunteers
      helpRequest.volunteers.push(user.id);
      helpRequest.updatedAt = new Date();
      
      return await helpRequest.save();
    },
    
    withdrawFromHelp: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const helpRequest = await HelpRequest.findById(helpRequestId);
      
      if (!helpRequest) {
        throw new Error('Help request not found');
      }
      
      // Check if user is a volunteer
      const volunteerIndex = helpRequest.volunteers.findIndex(
        (volunteerId) => volunteerId.toString() === user.id
      );
      
      if (volunteerIndex === -1) {
        throw new Error('You are not volunteering for this help request');
      }
      
      // Remove user from volunteers
      helpRequest.volunteers.splice(volunteerIndex, 1);
      helpRequest.updatedAt = new Date();
      
      return await helpRequest.save();
    }
  },
  
  // Field resolvers
  CommunityPost: {
    author: async (post) => {
      // In a real application, this would fetch the user from the auth service
      // For now, we'll return a placeholder
      return { id: post.author, username: 'User', role: 'resident' };
    }
  },
  
  HelpRequest: {
    author: async (helpRequest) => {
      // In a real application, this would fetch the user from the auth service
      return { id: helpRequest.author, username: 'User', role: 'resident' };
    },
    
    volunteers: async (helpRequest) => {
      // In a real application, this would fetch the users from the auth service
      return helpRequest.volunteers.map(id => ({ 
        id, 
        username: `Volunteer-${id.toString().slice(-4)}`,
        role: 'resident'
      }));
    }
  }
};

export default resolvers;