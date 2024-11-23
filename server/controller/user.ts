/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';
import { updateUserStatus } from '../models/application';

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
      const { username, community } = req.body;

      if (!username) {
        return res.status(400).json({ message: 'Username and community are required' });
      }

      const user = await UserModel.findOneAndUpdate({ username }, { community }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating community' });
    }
  });

  router.get('/getUser', async (req: Request, res: Response) => {
    try {
      const { username } = req.query;

      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      const user = await UserModel.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }
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

  router.put('/increaseUserStatus', async (req: Request, res: Response) => {
    try {
      const { username } = req.body;

      const status = 'moderator';
      const user = await UserModel.findOneAndUpdate({ username }, { status }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'No users not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  return router;
};

export default userController;
