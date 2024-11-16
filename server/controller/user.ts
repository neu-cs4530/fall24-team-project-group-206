/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import UserModel from '../models/users';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Adds a new user to the database.
   */
  router.post('/add', async (req: Request, res: Response) => {
    try {
      const { username, firstName, lastName, tags, status } = req.body;

      const newUser = await UserModel.create({
        username,
        firstName,
        lastName,
        tags: tags || [],
        status,
      });

      return res.status(200).json(newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};

export default userController;
