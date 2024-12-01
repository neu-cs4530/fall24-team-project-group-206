import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';

const userController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Adds a new user to the database.
   * @param req The Request object that contains the all the information of users.
   * @param res The HTTP response object used to add users.
   *
   * @returns A Promise that resolves to void.
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
   * @param req The Request object that contains the username and tags of a user.
   * @param res The HTTP response object used to update the user tag list.
   *
   * @returns A Promise that resolves to void.
   */
  const updateUserTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, tags } = req.body;

      const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { $set: { tags } },
        { new: true },
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
   * Updates the users community.
   * @param req The Request object that contains the community name and username.
   * @param res The HTTP response object used to update the users community.
   *
   * @returns A Promise that resolves to void.
   */
  const updateUserCommunity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, community } = req.body;
      const user = await UserModel.findOneAndUpdate({ username }, { community }, { new: true });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating community' });
    }
  };

  /**
   * Retrieves user data based on the provided username.
   * @param req The Request object that a username.
   * @param res The HTTP response object used to retreive user data.
   *
   * @returns A Promise that resolves to void.
   */
  const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.query;

      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }

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

  /**
   * Returns all the users.
   * @param req The Request object that contains all the users.
   * @param res The HTTP response object used to get all the users.
   */
  router.get('/getListOfAllUsers', async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }
  });

  /**
   * Increases a users status to moderator.
   * @param req The Request object that contains the username.
   * @param res The HTTP response object used to incerase user status.
   */
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
