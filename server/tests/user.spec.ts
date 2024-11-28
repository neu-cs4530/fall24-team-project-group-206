import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import userController from '../controller/user';
import UserModel from '../models/users';

jest.mock('../models/users');

const app = express();
app.use(express.json());
app.use('/user', userController({ emit: jest.fn() })); // Mock socket

beforeAll(async () => {
  // Initialize an in-memory MongoDB instance
  await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /user/updateTags', () => {
    it('should return 404 if the user is not found', async () => {
      jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(null); // Simulate no user found

      const response = await request(app).put('/user/updateTags').send({
        username: 'nonexistentUser',
        tags: ['newTag'],
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 if username or tags are missing', async () => {
      const response = await request(app).put('/user/updateTags').send({
        username: '', // Missing tags
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and tags are required');
    });
  });

  describe('PUT /user/updateCommunity', () => {
    it('should return 404 if the user is not found', async () => {
      jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue(null); // Simulate no user found

      const response = await request(app).put('/user/updateCommunity').send({
        username: 'nonexistentUser',
        community: 'newCommunity',
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 400 if username is missing', async () => {
      const response = await request(app).put('/user/updateCommunity').send({
        community: 'newCommunity',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username required');
    });
  });

  describe('GET /user/getListOfAllUsers', () => {
    it('should return 404 if no users exist', async () => {
      jest.spyOn(UserModel, 'find').mockResolvedValue([]); // Simulate empty database

      const response = await request(app).get('/user/getListOfAllUsers');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No users not found');
    });
  });
});
