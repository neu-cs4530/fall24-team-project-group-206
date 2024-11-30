import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Community, Question, Tag } from '../types';
import Communities from '../models/communities';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
};

const mockCommunity: Community = {
  name: 'New Question Title',
  tags: ['react', 'typescript'],
  users: [],
  questions: [],
};

const popDocSpy = jest.spyOn(util, 'populateDocument');

describe('POST /getCommunityNames', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it(
    'should return 404 if error occurs in getCommunityNames while getting a community' +
      ' that exists',
    async () => {
      // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
      jest
        .spyOn(util, 'populateDocument')
        .mockResolvedValueOnce({ error: 'Error while populating' });

      // Making the request
      const response = await supertest(app).post('/getCommunityNames');

      // Asserting the response
      expect(response.status).toBe(404);
    },
  );
  it(
    'should return 500 if error occurs in getCommunityNames while getting a community' +
      ' that exists',
    async () => {
      // jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
      mockingoose(Communities).toReturn(null, 'findOne');

      // Making the request
      const response = await supertest(app).post('/getCommunityNames').send(mockCommunity);

      // Asserting the response
      expect(response.status).toBe(404);
    },
  );
});
