/* eslint-disable import/no-duplicates */
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
// import * as util from '../models/application';
import { Question, Tag } from '../types';
import Communities from '../models/communities';
import CommunityModel from '../models/communities';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const findSpy = jest.spyOn(CommunityModel, 'find');
const findOneSpy = jest.spyOn(CommunityModel, 'findOne');

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

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6eaaa'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [],
    askedBy: 'question_user1',
    askDateTime: new Date(),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('507f191e810c19729de86bbb'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [],
    askedBy: 'question_user2',
    askDateTime: new Date(),
    views: ['question_user2'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const EXPECTED_QUESTIONS = MOCK_QUESTIONS.map(question => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  askDateTime: question.askDateTime.toISOString(),
}));

const mockCommunity1 = {
  name: 'exampleCommunity1',
  tags: ['exampleTag1', 'exampleTag2'],
  users: ['exampleUser1', 'exampleUser2'],
  questions: [EXPECTED_QUESTIONS[0]],
};
const mockCommunity2 = {
  name: 'exampleCommunity2',
  tags: ['exampleTag3'],
  users: ['exampleUser3', 'exampleUser4'],
  questions: [EXPECTED_QUESTIONS[1]],
};

describe('GET /getCommunityNames', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    findSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });
  it('should return all community names', async () => {
    findSpy.mockResolvedValueOnce([mockCommunity1, mockCommunity2]);

    const response = await supertest(app).get('/community/getCommunityNames');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockCommunity1, mockCommunity2]);
  });
  it('should return error 500 if getCommunityNames throws an error', async () => {
    jest
      .spyOn(CommunityModel, 'find')
      .mockRejectedValueOnce(new Error('Failed to retreive communities'));
    const response = await supertest(app).get('/community/getCommunityNames');
    expect(response.status).toBe(500);
  });

  it('should return 404 if community not found', async () => {
    mockingoose(Communities).toReturn(null, 'find');
    const response = await supertest(app).post('/community/getCommunityNames');
    expect(response.status).toBe(404);
  });
});

describe('GET /getCommunityMembers', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    findOneSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
  it('should return a community by its name', async () => {
    findOneSpy.mockResolvedValueOnce({
      name: mockCommunity1.name,
      users: ['exampleUser1', 'exampleUser2'],
    });
    const response = await supertest(app).get(
      `/community/getCommunityMembers/${mockCommunity1.name}`,
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(['exampleUser1', 'exampleUser2']);
  });
  it('should return a 500 community by its name', async () => {
    jest
      .spyOn(CommunityModel, 'findOne')
      .mockRejectedValueOnce(new Error('Failed to retreive communities'));
    const response = await supertest(app).get(
      `/community/getCommunityMembers/${mockCommunity1.name}`,
    );
    expect(response.status).toBe(500);
  });
  it('should return 404 if community not found', async () => {
    mockingoose(Communities).toReturn(null, 'findOne');
    const response = await supertest(app).get(
      `/community/getCommunityMembers/${mockCommunity1.name}`,
    );
    expect(response.status).toBe(404);
  });
});

describe('GET /getRelevantCommunities', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    findSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
  it('should return 400 if community not found', async () => {
    mockingoose(Communities).toReturn(null, 'find');
    const response = await supertest(app).get(`/community/getRelevantCommunities`);
    expect(response.status).toBe(400);
  });
});

describe('PATCH /addUserToCommunity', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    findSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 404 if community not found', async () => {
    mockingoose(Communities).toReturn(null, 'find');
    const response = await supertest(app).post('/community/getCommunityNames');
    expect(response.status).toBe(404);
  });
});

describe('GET /updateCommunityQuestions', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    findOneSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 404 if community not found', async () => {
    mockingoose(Communities).toReturn(null, 'findOne');
    const response = await supertest(app).get(
      `/community/updateCommunityQuestions/${mockCommunity1.name}`,
    );
    expect(response.status).toBe(404);
  });
});
