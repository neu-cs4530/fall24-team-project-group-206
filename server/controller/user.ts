import express, { Request, Response, Router } from 'express';
import UserModel from '../models/communities';

const userController = () => {
  const router: Router = express.Router();

  return router;
};

export default userController;
