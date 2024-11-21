/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';
import CommunityModel from '../models/communities';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Adds a new user to the database.
   */
  router.post('/add', async (req: Request, res: Response) => {
    try {
      const { username, firstName, lastName, tags, community, status } = req.body;

      const newUser = await UserModel.create({
        username,
        firstName,
        lastName,
        tags: tags || [],
        community: community || '',
        status,
      });

      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: 'Error adding user' });
    }
  });

  router.put('/updateTags', async (req: Request, res: Response) => {
    try {
      const { username, tags } = req.body;

      if (!username || !tags) {
        return res.status(400).json({ error: 'Username and tags are required' });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { $set: { tags } },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating tags' });
    }
  });

  router.put('/updateCommunity', async (req: Request, res: Response) => {
    try {
      const { username, community: newCommunity } = req.body;
  
      if (!username || !newCommunity) {
        return res.status(400).json({ message: 'Username and community are required' });
      }
  
      // Find the user to get their current community
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const oldCommunity = user.community;
  
      // Update the user's community
      user.community = newCommunity;
      await user.save();
  
      // Remove the user from the old community if it exists
      if (oldCommunity) {
        await CommunityModel.updateOne(
          { name: oldCommunity },
          { $pull: { users: username } } // Remove the username from the users array
        );
      }
  
      // Add the user to the new community
      await CommunityModel.updateOne(
        { name: newCommunity },
        { $addToSet: { users: username } }, // Add the username to the users array (no duplicates)
        { upsert: true } // If the community doesn't exist, create it
      );
  
      return res.status(200).json(user); // Return the updated user
    } catch (error) {
      console.error('Error updating community:', error);
      return res.status(500).json({ message: 'Error updating community' });
    }
  });
  

  router.get('/getUser', async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    return res.status(200).json(user);
  });
  

  router.get('/getListOfAllUsers', async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();

      if (!users) {
        return res.status(404).json({ message: 'No users not found' });
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  return router;
};

export default userController;
