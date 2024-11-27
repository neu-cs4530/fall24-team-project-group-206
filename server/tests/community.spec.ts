import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import communityController from '../controllers/communityController';
import CommunityModel from '../models/communities';
import TagModel from '../models/tags';
import QuestionModel from '../models/questions';

// Mock socket for testing
const mockSocket = {
  emit: jest.fn(),
};

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = express();
  app.use(express.json());
  app.use('/api/community', communityController(mockSocket));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Community Controller', () => {
  beforeEach(async () => {
    await CommunityModel.deleteMany({});
    await TagModel.deleteMany({});
    await QuestionModel.deleteMany({});
    jest.clearAllMocks();
  });

  describe('GET /api/community/getCommunityNames', () => {
    it('should retrieve a list of community names', async () => {
      await CommunityModel.create([{ name: 'Community1' }, { name: 'Community2' }]);

      const response = await request(app).get('/api/community/getCommunityNames');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Community1');
    });

    it('should return an empty list when no communities exist', async () => {
      const response = await request(app).get('/api/community/getCommunityNames');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/community/getCommunityMembers/:community', () => {
    it('should retrieve users of a specific community', async () => {
      const community = await CommunityModel.create({ name: 'Community1', users: ['user1', 'user2'] });

      const response = await request(app).get(`/api/community/getCommunityMembers/${community.name}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(['user1', 'user2']);
    });

    it('should return 404 for a non-existent community', async () => {
      const response = await request(app).get('/api/community/getCommunityMembers/NonExistentCommunity');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/community/addUserToCommunity', () => {
    it('should add a user to a community', async () => {
      const community = await CommunityModel.create({ name: 'Community1', users: [] });

      const response = await request(app)
        .patch('/api/community/addUserToCommunity')
        .send({ username: 'user1', community: community.name });
      expect(response.status).toBe(200);

      const updatedCommunity = await CommunityModel.findOne({ name: community.name });
      expect(updatedCommunity?.users).toContain('user1');
      expect(mockSocket.emit).toHaveBeenCalledWith('communityUpdate', {
        name: community.name,
        users: ['user1'],
      });
    });

    it('should remove the user from all communities if no community is provided', async () => {
      const community1 = await CommunityModel.create({ name: 'Community1', users: ['user1'] });
      const community2 = await CommunityModel.create({ name: 'Community2', users: ['user1'] });

      const response = await request(app)
        .patch('/api/community/addUserToCommunity')
        .send({ username: 'user1' });
      expect(response.status).toBe(200);

      const updatedCommunity1 = await CommunityModel.findOne({ name: community1.name });
      const updatedCommunity2 = await CommunityModel.findOne({ name: community2.name });
      expect(updatedCommunity1?.users).not.toContain('user1');
      expect(updatedCommunity2?.users).not.toContain('user1');
    });
  });

  describe('GET /api/community/getRelevantCommunities', () => {
    it('should return communities matching the provided tags', async () => {
      const tag = await TagModel.create({ name: 'Tag1' });
      await CommunityModel.create({ name: 'Community1', tags: [tag.name] });

      const response = await request(app).get('/api/community/getRelevantCommunities').query({ tags: ['Tag1'] });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(['Community1']);
    });

    it('should return an empty list if no communities match the tags', async () => {
      const response = await request(app).get('/api/community/getRelevantCommunities').query({ tags: ['NonExistentTag'] });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('PATCH /api/community/updateCommunityQuestions/:communityName', () => {
    it('should update a community with a new question', async () => {
      const question = await QuestionModel.create({ text: 'Sample Question', tags: [], answers: [] });
      const community = await CommunityModel.create({ name: 'Community1', questions: [] });

      const response = await request(app)
        .patch(`/api/community/updateCommunityQuestions/${community.name}`)
        .send({ questionId: question._id });
      expect(response.status).toBe(200);

      const updatedCommunity = await CommunityModel.findOne({ name: community.name });
      expect(updatedCommunity?.questions).toContainEqual(question._id);
    });

    it('should return 404 if the community is not found', async () => {
      const question = await QuestionModel.create({ text: 'Sample Question', tags: [], answers: [] });

      const response = await request(app)
        .patch('/api/community/updateCommunityQuestions/NonExistentCommunity')
        .send({ questionId: question._id });
      expect(response.status).toBe(404);
    });
  });
});
