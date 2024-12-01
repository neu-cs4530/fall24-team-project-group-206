import supertest from 'supertest';
import express from 'express';
import userController from '../controller/user';
import UserModel from '../models/users';
import { FakeSOSocket } from '../types';

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

    it('should return 404 if user is not found', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ username: 'nonexistent', tags: ['tag1'] });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if there is an error updating tags', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/users/updateTags')
        .send({ username: 'testuser', tags: ['tag1'] });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating tags');
    });
  });

  describe('PUT /users/updateCommunity', () => {
    it('should update the community for a user successfully', async () => {
      const mockUser = { username: 'testuser', community: 'NewCommunity' };

      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const response = await supertest(app)
        .put('/users/updateCommunity')
        .send({ username: 'testuser', community: 'NewCommunity' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .put('/users/updateCommunity')
        .send({ username: 'nonexistent', community: 'NewCommunity' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if there is an error updating the community', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .put('/users/updateCommunity')
        .send({ username: 'testuser', community: 'NewCommunity' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community');
    });
  });

  describe('GET /users/getUser', () => {
    it('should retrieve a user successfully', async () => {
      const mockUser = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        tags: ['tag1', 'tag2'],
        community: 'Community1',
        status: 'member',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await supertest(app).get('/users/getUser').query({ username: 'testuser' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 400 if username is missing', async () => {
      const response = await supertest(app).get('/users/getUser');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username is required');
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .get('/users/getUser')
        .query({ username: 'unknownUser' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if there is an error fetching user data', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/users/getUser').query({ username: 'testuser' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error fetching user data');
    });
  });

  describe('GET /users/getListOfAllUsers', () => {
    it('should return a list of all users successfully', async () => {
      const mockUsers = [
        { username: 'testuser1', firstName: 'Test', lastName: 'User1' },
        { username: 'testuser2', firstName: 'Test', lastName: 'User2' },
      ];

      (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

      const response = await supertest(app).get('/users/getListOfAllUsers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 if there is an error fetching users', async () => {
      (UserModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/users/getListOfAllUsers');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching user data');
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

      const response = await supertest(app)
        .put('/users/increaseUserStatus')
        .send({ username: 'nonexistentUser' });

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
});
