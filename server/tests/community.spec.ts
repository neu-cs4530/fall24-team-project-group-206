import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../app';
import CommunityModel from '../models/communities';
import QuestionModel from '../models/questions';

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
});

afterAll(async () => {
  // Disconnect from the database after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  // Clear collections after each test
  await CommunityModel.deleteMany({});
  await QuestionModel.deleteMany({});
});

describe('Community API', () => {
  describe('GET /community/getCommunityByName/:name', () => {
    it('should return a community by its name', async () => {
      const community = await CommunityModel.create({
        name: 'Community1',
        tags: ['tag1', 'tag2'],
        users: ['user1', 'user2'],
        questions: [],
      });

      const response = await request(app).get(`/community/getCommunityByName/${community.name}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Community1');
      expect(response.body.tags).toContain('tag1');
    });

    it('should return 404 if the community is not found', async () => {
      const response = await request(app).get('/community/getCommunityByName/NonExistentCommunity');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Community not found');
    });

    it('should return 500 if there is a server error', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app).get('/community/getCommunityByName/ErrorCommunity');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error fetching community');

      jest.restoreAllMocks();
    });
  });

  describe('PATCH /community/addUserToCommunity', () => {
    it('should add a user to a community', async () => {
      const community = await CommunityModel.create({
        name: 'Community1',
        tags: ['tag1', 'tag2'],
        users: ['user1'],
        questions: [],
      });

      const response = await request(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: 'Community1', userName: 'user2' });

      expect(response.status).toBe(200);
      expect(response.body).toBe('Successfully added to the community users list');

      const updatedCommunity = await CommunityModel.findOne({ name: 'Community1' });
      expect(updatedCommunity?.users).toContain('user2');
    });

    it('should return 404 if the community is not found', async () => {
      const response = await request(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: 'NonExistentCommunity', userName: 'user1' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Community not found');
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: 'Community1', userName: 'user2' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');

      jest.restoreAllMocks();
    });
  });

  describe('PATCH /community/updateCommunityQuestions/:communityName', () => {
    it('should add a question to a community', async () => {
      const community = await CommunityModel.create({
        name: 'Community1',
        tags: ['tag1', 'tag2'],
        users: ['user1'],
        questions: [],
      });

      const question = await QuestionModel.create({
        title: 'Question Title',
        text: 'Question content',
        tags: [],
        askedBy: 'user1',
        askDateTime: new Date(),
        answers: [],
        views: [],
        upVotes: [],
        downVotes: [],
        comments: [],
      });

      const response = await request(app)
        .patch(`/community/updateCommunityQuestions/${community.name}`)
        .send({ questionId: question._id });

      expect(response.status).toBe(200);

      const updatedCommunity = await CommunityModel.findOne({ name: 'Community1' });
      expect(updatedCommunity?.questions).toContainEqual(question._id);
    });
  });

  describe('GET /community/getRelevantCommunities', () => {
    it('should return communities matching the provided tags', async () => {
      await CommunityModel.create({
        name: 'Community1',
        tags: ['tag1', 'tag2'],
        users: ['user1'],
        questions: [],
      });

      await CommunityModel.create({
        name: 'Community2',
        tags: ['tag3'],
        users: ['user2'],
        questions: [],
      });

      const response = await request(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['tag1'] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining(['Community1']));
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(CommunityModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['tag1'] });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error fetching relevant communities');

      jest.restoreAllMocks();
    });
  });
});
