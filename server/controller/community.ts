/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';

const communityController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Retrieves a list of communities along with metadata.
   */
  const getCommunityNames = async (_: Request, res: Response): Promise<void> => {
    try {
      const communities = await CommunityModel.find({});
      res.json(communities);
    } catch (error) {
      console.error('Error retrieving communities:', error);
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  /**
   * Retrieves a specific community by name.
   */
  const getCommunityByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const community = await CommunityModel.findOne({ name });
      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }
      res.status(200).json(community);
    } catch (error) {
      console.error('Error fetching community:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const addUserToCommunity = (socket: FakeSOSocket) => async (req: Request, res: Response): Promise<void> => {
    const { communityName } = req.params;
    const { username } = req.body;
  
    try {
      // Step 1: Remove the user from their current community.
      const currentCommunity = await CommunityModel.findOne({ users: username });
  
      if (currentCommunity) {
        currentCommunity.users = currentCommunity.users.filter(user => user !== username);
        await currentCommunity.save();
        console.log(`Removed user ${username} from community ${currentCommunity.name}`);
  
        // Emit update to old community.
        socket.emit('communityUpdate', {
          name: currentCommunity.name,
          tags: currentCommunity.tags,
          users: currentCommunity.users,
          questions: currentCommunity.questions,
        });
      }
  
      // Step 2: Add the user to the new community.
      const newCommunity = await CommunityModel.findOneAndUpdate(
        { name: communityName },
        { $addToSet: { users: username } }, // Prevent duplicate entries
        { new: true } // Return the updated document
      );
  
      if (!newCommunity) {
        res.status(404).json({ error: 'Community not found' });
        return; // Exit the function early
      }
  
      console.log(`Added user ${username} to community ${newCommunity.name}`);
  
      // Step 3: Update the user's community field in UserModel.
      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { community: newCommunity.name }, // Update the community field
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found!' });
        return; // Exit the function early
      }
  
      console.log(`Updated user's community field for ${username}`);
  
      // Emit update to new community.
      socket.emit('communityUpdate', {
        name: newCommunity.name,
        tags: newCommunity.tags,
        users: newCommunity.users,
        questions: newCommunity.questions,
      });
  
      // Send success response.
      res.status(200).json({
        message: `User "${username}" successfully added to the community "${communityName}"`,
        community: newCommunity,
      });
    } catch (err) {
      console.error('Error updating community:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  // Define the routes
  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityByName/:name', getCommunityByName);
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity(socket));

  return router;
};

export default communityController;
