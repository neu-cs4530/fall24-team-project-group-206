import mongoose from 'mongoose';
import supertest from 'supertest';
import express from 'express';
import userController from '../controller/user';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

// Mock the UserModel
jest.mock('../models/users');

// Mock the socket
const mockSocketEmit = jest.fn();
const mockSocket = {
  emit: mockSocketEmit,
} as unknown as FakeSOSocket;

// Setup Express app with the user controller
const app = express();
app.use(express.json());
app.use('/users', userController(mockSocket));

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('POST /users/add', () => {
    it('should add a new user successfully', async () => {
      const mockUser = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        tags: ['tag1', 'tag2'],
        community: 'Community1',
        status: 'member',
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await supertest(app).post('/users/add').send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 500 if there is an error adding a user', async () => {
      (UserModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).post('/users/add').send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error adding user');
    });
  });

  describe('PUT /users/updateTags', () => {
    it('should update user tags successfully', async () => {
      const updatedUser = { username: 'testuser', tags: ['tag1', 'tag2'] };

      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ username: 'testuser', tags: ['tag1', 'tag2'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    /* it('should return 400 if no user is passed in', async () => {
      // (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ tags: ['tag1'] });

      expect(response.status).toBe(400);
    }); */

    /* it('should return 404 if user is not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ username: 'nonexistent', tags: ['tag1'] });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    }); */

    it('should return 500 if there is an error updating tags', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ username: 'testuser', tags: ['tag1'] });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating tags');
    });
  });

  describe('PUT /users/increaseUserStatus', () => {
    it('should promote user to moderator successfully', async () => {
      const mockUser = { username: 'testuser', status: 'moderator' };

      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const response = await supertest(app)
        .put('/users/increaseUserStatus')
        .send({ username: 'testuser' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app).put('/users/increaseUserStatus').send({});

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No users not found');
    });

    it('should return 500 if there is an error updating user status', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/users/increaseUserStatus')
        .send({ username: 'testuser' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching user data');
    });
  });
  describe('PUT /updateUserCommunity', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should update user community and return 200', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
        username: 'testuser',
        community: 'Old Community',
      };

      const updatedUser = {
        _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
        username: 'testuser',
        community: 'New Community',
      };

      // Mock UserModel.findOneAndUpdate to return the updated user
      mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');

      // Make the request
      const response = await supertest(app)
        .put('/user/updateCommunity') // Ensure this matches your route
        .send({ username: 'testuser', community: 'New Community' });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
      expect(response.body.community).toBe('New Community');
    });

    it('should return 400 if username is missing', async () => {
      const response = await supertest(app)
        .put('/updateCommunity')
        .send({ community: 'New Community' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username required');
    });

    it('should return 404 if user is not found', async () => {
      // Mock UserModel.findOneAndUpdate to return null
      mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

      const response = await supertest(app)
        .put('/updateCommunity')
        .send({ username: 'nonexistentuser', community: 'New Community' });

      expect(response.status).toBe(404);
    });

    it('should return 500 on server error', async () => {
      // Mock UserModel.findOneAndUpdate to throw an error
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

      const response = await supertest(app)
        .put('/updateCommunity')
        .send({ username: 'testuser', community: 'New Community' });

      //  const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community');
    });
  });
});
