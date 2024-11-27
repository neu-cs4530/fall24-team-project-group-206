import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import CommunityModel from '../models/communities';

// Spy on the CommunityModel methods
const findSpy = jest.spyOn(CommunityModel, 'find');
const findOneSpy = jest.spyOn(CommunityModel, 'findOne');
const findOneAndUpdateSpy = jest.spyOn(CommunityModel, 'findOneAndUpdate');

describe('Community API', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.clearAllMocks(); // Clear all spies after each test
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('GET /community/getCommunityNames', () => {
    it('should return a list of community names', async () => {
      // Mock a list of communities
      const mockCommunities = [
        { name: 'Community1', tags: ['tag1'], users: [], questions: [] },
        { name: 'Community2', tags: ['tag2'], users: [], questions: [] },
      ];
      findSpy.mockResolvedValueOnce(mockCommunities);

      const response = await supertest(app).get('/community/getCommunityNames');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCommunities);
    });

    it('should return 500 if there is an error fetching community names', async () => {
      findSpy.mockRejectedValueOnce(new Error('Error fetching communities'));

      const response = await supertest(app).get('/community/getCommunityNames');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Failed to retrieve communities');
    });
  });

  describe('GET /community/getCommunityByName/:name', () => {
    it('should return the community when found', async () => {
      const mockCommunity = {
        name: 'Community1',
        tags: ['tag1'],
        users: ['user1'],
        questions: [],
      };
      findOneSpy.mockResolvedValueOnce(mockCommunity);

      const response = await supertest(app).get('/community/getCommunityByName/Community1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCommunity);
    });

    it('should return 404 if the community is not found', async () => {
      findOneSpy.mockResolvedValueOnce(null);

      const response = await supertest(app).get('/community/getCommunityByName/NonExistentCommunity');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Community with name "NonExistentCommunity" not found');
    });

    it('should return 500 if there is an error fetching the community', async () => {
      findOneSpy.mockRejectedValueOnce(new Error('Error fetching community'));

      const response = await supertest(app).get('/community/getCommunityByName/ErrorCommunity');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching community');
    });
  });

  describe('PATCH /community/addUserToCommunity/:communityName', () => {
    it('should add a user to a community and return the updated community', async () => {
      const mockCommunity = {
        name: 'Community1',
        tags: ['tag1'],
        users: ['user1'],
        questions: [],
      };
      findOneAndUpdateSpy.mockResolvedValueOnce(mockCommunity);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity/Community1')
        .send({ username: 'user1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCommunity);
    });

    it('should return 404 if the community is not found', async () => {
      findOneAndUpdateSpy.mockResolvedValueOnce(null);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity/NonExistentCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Community not found');
    });

    it('should return 500 if there is an error adding the user to the community', async () => {
      findOneAndUpdateSpy.mockRejectedValueOnce(new Error('Error updating community'));

      const response = await supertest(app)
        .patch('/community/addUserToCommunity/ErrorCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when adding user to community');
    });
  });

  describe('GET /community/getRelevantCommunities', () => {
    it('should return communities matching the provided tags', async () => {
      const mockCommunities = ['Community1', 'Community2'];
      findSpy.mockResolvedValueOnce(mockCommunities);

      const response = await supertest(app).get('/community/getRelevantCommunities').query({ tags: ['tag1', 'tag2'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCommunities);
    });

    it('should return 400 if tags are invalid or missing', async () => {
      const response = await supertest(app).get('/community/getRelevantCommunities').query({ tags: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid or missing tags' });
    });

    it('should return 500 if there is an error fetching relevant communities', async () => {
      findSpy.mockRejectedValueOnce(new Error('Error fetching relevant communities'));

      const response = await supertest(app).get('/community/getRelevantCommunities').query({ tags: ['tag1'] });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error fetching relevant communities');
    });
  });
});
