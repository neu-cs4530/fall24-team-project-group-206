import request from 'supertest';
import express from 'express';
import userController from '../controller/user';
import UserModel from '../models/users';

// Mock the UserModel module
jest.mock('../models/users');

const app = express();
app.use(express.json());
app.use('/users', userController());

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  describe('POST /users/add', () => {
    it('should add a new user and return 200 with the created user', async () => {
      const mockUser = {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        tags: ['tag1', 'tag2'],
        community: 'Test Community',
        status: 'low',
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/users/add').send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(UserModel.create).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 if there is an error adding a user', async () => {
      (UserModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/users/add').send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error adding user');
      expect(UserModel.create).toHaveBeenCalled();
    });
  });

  describe('PUT /users/updateTags', () => {
    it('should update user tags and return 200 with the updated user', async () => {
      const mockUser = { username: 'johndoe', tags: ['tag1', 'tag2'] };

      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/users/updateTags')
        .send({ username: 'johndoe', tags: ['tag1', 'tag2'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'johndoe' },
        { $set: { tags: ['tag1', 'tag2'] } },
        { new: true }
      );
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/users/updateTags')
        .send({ username: 'nonexistent', tags: ['tag1'] });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 500 if there is an error updating tags', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/users/updateTags')
        .send({ username: 'johndoe', tags: ['tag1'] });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating tags');
    });
  });

  describe('PUT /users/updateCommunity', () => {
    it('should update community and return 200 with the updated user', async () => {
      const mockUser = { username: 'johndoe', community: 'Updated Community' };

      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/users/updateCommunity')
        .send({ username: 'johndoe', community: 'Updated Community' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/users/updateCommunity')
        .send({ username: 'nonexistent', community: 'Community' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if there is an error updating community', async () => {
      (UserModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/users/updateCommunity')
        .send({ username: 'johndoe', community: 'Community' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error updating community');
    });
  });

  describe('GET /users/getUser', () => {
    it('should return user data when found', async () => {
      const mockUser = { username: 'johndoe', firstName: 'John', lastName: 'Doe' };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/users/getUser').query({ username: 'johndoe' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/users/getUser').query({ username: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if there is an error fetching user data', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/getUser').query({ username: 'johndoe' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching user data');
    });
  });

  describe('GET /users/getListOfAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ username: 'johndoe' }, { username: 'janedoe' }];

      (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users/getListOfAllUsers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 404 if no users are found', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/users/getListOfAllUsers');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No users found');
    });

    it('should return 500 if there is an error fetching user data', async () => {
      (UserModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/users/getListOfAllUsers');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error fetching user data');
    });
  });
});
