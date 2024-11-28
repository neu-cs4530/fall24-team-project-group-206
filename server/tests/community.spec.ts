import mongoose from 'mongoose';
import supertest from 'supertest';
import {app} from '../app';
import CommunityModel from '../models/communities';

const mongoURI = 'mongodb://127.0.0.1:27017/testdb';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

let testCommunity: any;

beforeEach(async () => {
  // Clear and seed test database
  await CommunityModel.deleteMany({});
  testCommunity = await CommunityModel.create({
    name: 'TestCommunity',
    tags: ['test'],
    users: [],
    questions: [],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Community API', () => {
  describe('GET /community/getCommunityByName/:name', () => {
    it('should return a community by its name', async () => {
      const response = await supertest(app).get(`/community/getCommunityByName/${testCommunity.name}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testCommunity.name);
    });

    it('should return 404 if the community is not found', async () => {
      const response = await supertest(app).get('/community/getCommunityByName/NonexistentCommunity');
      expect(response.status).toBe(404);
    });

    it('should return 500 if there is a server error', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await supertest(app).get('/community/getCommunityByName/ErrorCommunity');
      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /community/addUserToCommunity', () => {
    it('should add a user to a community', async () => {
      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: testCommunity.name, userName: 'TestUser' });
      expect(response.status).toBe(200);
      expect(response.text).toBe('"successfully added to the community users list"');

      const updatedCommunity = await CommunityModel.findOne({ name: testCommunity.name });
      expect(updatedCommunity?.users).toContain('TestUser');
    });

    it('should return 404 if the community is not found', async () => {
      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: 'NonexistentCommunity', userName: 'TestUser' });
      expect(response.status).toBe(404);
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ communityName: testCommunity.name, userName: 'TestUser' });
      expect(response.status).toBe(500);
    });
  });

  describe('GET /community/getRelevantCommunities', () => {
    it('should return communities matching the provided tags', async () => {
      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['test'] });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([testCommunity.name]));
    });

    it('should return 500 on server error', async () => {
      jest.spyOn(CommunityModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['test'] });
      expect(response.status).toBe(500);
    });
  });
});
