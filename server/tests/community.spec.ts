import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import CommunityModel from '../models/communities';
import QuestionModel from '../models/questions';
import { Community, Question } from '../types';

const MOCK_COMMUNITY = {
  _id: '6748ace874cbc47a46fbf980',
  name: 'Community 1',
  tags: ['tag1', 'tag2'],
  users: ['user1', 'user2'],
  questions: ['507f191e810c19729de860ea'],
};

const MOCK_POPULATED_COMMUNITY = {
  ...MOCK_COMMUNITY,
  questions: [
    {
      _id: '507f191e810c19729de860ea',
      title: 'Sample Question',
      text: 'Sample text for the question',
      tags: [
        {
          _id: '65e9a5c2b26199dbcc3e6dc8',
          name: 'tag1',
          description: 'description1',
        },
      ],
      answers: [],
      askedBy: 'user1',
      askDateTime: '2024-01-01T00:00:00.000Z',
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
    },
  ],
};

const MOCK_QUESTION = {
  _id: '507f191e810c19729de860ea',
  title: 'Sample Question',
  text: 'Sample text for the question',
  tags: ['tag1'],
  answers: [],
  askedBy: 'user1',
  askDateTime: '2024-01-01T00:00:00.000Z',
  views: [],
  upVotes: [],
  downVotes: [],
  comments: [],
};

describe('Community Controller', () => {
  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /community/getCommunityNames', () => {
    it('should return all community names', async () => {
      jest.spyOn(CommunityModel, 'find').mockResolvedValueOnce([MOCK_COMMUNITY]);

      const response = await request(app).get('/community/getCommunityNames');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([MOCK_COMMUNITY]);
    });

    it('should handle database errors when retrieving community names', async () => {
      jest.spyOn(CommunityModel, 'find').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/community/getCommunityNames');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve communities');
    });
  });

  describe('GET /community/getCommunityQuestions/:community', () => {
    it('should return questions for a given community', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockResolvedValueOnce(MOCK_POPULATED_COMMUNITY);

      const response = await request(app).get('/community/getCommunityQuestions/Community 1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MOCK_POPULATED_COMMUNITY.questions);
    });

    it('should return 404 if the community is not found', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockResolvedValueOnce(null);

      const response = await request(app).get('/community/getCommunityQuestions/Unknown Community');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Community not found');
    });

    it('should handle database errors when retrieving questions', async () => {
      jest.spyOn(CommunityModel, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/community/getCommunityQuestions/Community 1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error retrieving questions for the community');
    });
  });

  describe('PATCH /community/updateCommunityQuestions/:communityName', () => {
    it('should add a question to a community', async () => {
      jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(MOCK_QUESTION);
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockResolvedValueOnce(MOCK_COMMUNITY);
      jest.spyOn(CommunityModel, 'findOne').mockResolvedValueOnce(MOCK_POPULATED_COMMUNITY);

      const response = await request(app)
        .patch('/community/updateCommunityQuestions/Community 1')
        .send({ questionId: MOCK_QUESTION._id });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MOCK_COMMUNITY);
    });

    it('should return 404 if the question is not found', async () => {
      jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(null);

      const response = await request(app)
        .patch('/community/updateCommunityQuestions/Community 1')
        .send({ questionId: 'unknownId' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Question not found.');
    });

    it('should return 404 if the community is not found', async () => {
      jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(MOCK_QUESTION);
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const response = await request(app)
        .patch('/community/updateCommunityQuestions/Community 1')
        .send({ questionId: MOCK_QUESTION._id });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Community not found.');
    });

    it('should handle database errors when updating community questions', async () => {
      jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(MOCK_QUESTION);
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .patch('/community/updateCommunityQuestions/Community 1')
        .send({ questionId: MOCK_QUESTION._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });
  });

  describe('PATCH /community/addUserToCommunity', () => {
    it('should add a user to a community', async () => {
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockResolvedValueOnce(MOCK_COMMUNITY);

      const response = await request(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1', community: MOCK_COMMUNITY.name });

      expect(response.status).toBe(200);
      expect(response.body).toBe('successfully added to the community users list');
    });

    it('should handle database errors when adding a user to a community', async () => {
      jest.spyOn(CommunityModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1', community: MOCK_COMMUNITY.name });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');
    });
  });
});