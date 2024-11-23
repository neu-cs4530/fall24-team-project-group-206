import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';

const userController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Adds a new user to the database.
   */
  const addUser = async (req: Request, res: Response): Promise<void> => {
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

      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error adding user' });
    }
  };

  /**
   * Updates the tags for a given user.
   */
  const updateUserTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, tags } = req.body;

      if (!username || !tags) {
        res.status(400).json({ error: 'Username and tags are required' });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { $set: { tags } },
        { new: true },
      );

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating tags' });
    }
  };

  /**
   * Updates the community for a given user.
   */
  const updateUserCommunity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, community } = req.body;

      if (!username) {
        res.status(400).json({ error: 'Username required' });
      }

      const user = await UserModel.findOneAndUpdate({ username }, { community }, { new: true });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }
      // socket.emit('communityUpdate', {
      //   community,
      // });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating community' });
    }
  };

  /**
   * Retrieves user data based on the provided username.
   */
  const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.query;

      if (!username) {
        res.status(400).json({ error: 'Username is required' });
      }

      const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  };

  // Add routes to the router
  router.post('/add', addUser);
  router.put('/updateTags', updateUserTags);
  router.put('/updateCommunity', updateUserCommunity);
  router.get('/getUser', getUser);

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
