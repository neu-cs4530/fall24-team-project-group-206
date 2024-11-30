import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';

const userController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Adds a new user to the database.
   */
const addUser = async (req: Request, res: Response): Promise<void> => {
  const { username, firstName, lastName } = req.body;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  if (!firstName || !lastName) {
    res.status(400).json({ error: 'Required fields are missing' });
    return;
  }

  try {
    const newUser = await UserModel.create(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
};


const updateUserTags = async (req: Request, res: Response): Promise<void> => {
  const { username, tags } = req.body;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  if (!Array.isArray(tags)) {
    res.status(400).json({ error: 'Tags must be an array' });
    return;
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { tags },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
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
        return;
      }

      const user = await UserModel.findOneAndUpdate({ username }, { community }, { new: true });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating community' });
      return;
    }
  };

  

  /**
   * Retrieves user data based on the provided username.
   */
  const getUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
  
    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Invalid username format' });
      return;
    }
  
    try {
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
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
  
      if (!users || users.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching user data' }); // Added `error` key
      return;
    }
  });
  

  router.put('/increaseUserStatus', async (req: Request, res: Response) => {
    try {
      const { username } = req.body;

      const status = 'moderator';
      const user = await UserModel.findOneAndUpdate({ username }, { status }, { new: true });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
      return;
    }
  });

  return router;
};

export default userController;
