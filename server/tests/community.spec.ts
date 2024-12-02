import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import CommunityModel from '../models/communities';
import TagModel from '../models/tags';
import QuestionModel from '../models/questions';

jest.mock('../models/communities');
jest.mock('../models/tags');
jest.mock('../models/questions');

const mockObjectId = () => new mongoose.Types.ObjectId().toHexString();

describe('Community Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /getCommunityNames', () => {
    it('should return all communities successfully', async () => {
      const mockCommunities = [
        { _id: mockObjectId(), name: 'Community1' },
        { _id: mockObjectId(), name: 'Community2' },
      ];
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);

      const response = await supertest(app).get('/community/getCommunityNames');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCommunities);
    });

    it('should return 500 if an error occurs', async () => {
      (CommunityModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/community/getCommunityNames');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve communities');
    });
  });

  describe('GET /getCommunityQuestions/:community', () => {
    it('should return 500 if the community is not found', async () => {
      (CommunityModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app).get('/community/getCommunityQuestions/NonExistent');

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /addUserToCommunity', () => {
    it('should add a user to a community successfully', async () => {
      const mockReqBody = { username: 'user1', community: 'Community1' };
      const mockCommunity = {
        _id: mockObjectId(),
        name: 'Community1',
        users: ['user1'],
      };

      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send(mockReqBody);

      expect(response.status).toBe(500);
    });

    it('should return 404 if the specified community is not found', async () => {
      const mockReqBody = { username: 'user1', community: 'NonExistent' };

      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send(mockReqBody);

      expect(response.status).toBe(500);
    });

    it('should return 500 if an error occurs', async () => {
      const mockReqBody = { username: 'user1', community: 'Community1' };

      (CommunityModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');
    });

    it('should remove a user from all communities successfully', async () => {
      const mockCommunities = [
        { name: 'Community1', users: ['user1', 'user2'] },
        { name: 'Community2', users: ['user1'] },
      ];

      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockResolvedValue({});

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User removed from all communities successfully');
    });

    it('should return 500 if removing user fails', async () => {
      (CommunityModel.find as jest.Mock).mockResolvedValue([]);
      (CommunityModel.updateMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');
    });
  });

  describe('PATCH /addUserToCommunity', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    const mockCommunities = [
      { name: 'Community1', users: ['user1', 'user2'] },
      { name: 'Community2', users: ['user1'] },
    ];

    it('should remove a user from all communities successfully', async () => {
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockResolvedValue({});

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User removed from all communities successfully');
    });

    it('should add a user to a community successfully', async () => {
      const mockCommunity = {
        name: 'Community1',
        users: ['user1', 'user2'],
      };
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockResolvedValue({});
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user3', community: 'Community1' });

      expect(response.status).toBe(200);
      expect(response.text).toBe('"successfully added to the community users list"');
    });

    it('should return 404 if the specified community is not found', async () => {
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockResolvedValue({});
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user3', community: 'NonExistentCommunity' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Community not found');
    });

    it('should return 500 if error occurs while removing user from all communities', async () => {
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user1' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');
    });

    it('should return 500 if an error occurs while adding user to the new community', async () => {
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);
      (CommunityModel.updateMany as jest.Mock).mockResolvedValue({});
      (CommunityModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/addUserToCommunity')
        .send({ username: 'user3', community: 'Community1' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to add user to community');
    });
  });

  describe('PATCH /updateCommunityQuestions/:communityName', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    const mockQuestion = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Sample Question',
      text: 'This is a sample question.',
      tags: ['tag1', 'tag2'],
      askedBy: 'user1',
      askDateTime: new Date().toISOString(),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      answers: [],
    };

    it('should add a question to a community successfully', async () => {
      const mockCommunity = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Community1',
        questions: [mockQuestion],
      };

      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findOne as jest.Mock).mockResolvedValue({
        ...mockCommunity,
        questions: [mockQuestion],
      });

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
    });

    it('should return 404 if the question is not found', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(404);
    });

    it('should return 404 if the community is not found', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/NonExistentCommunity')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });

    it('should return 500 if an error occurs during the database query', async () => {
      (QuestionModel.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });

    it('should return 400 if the questionId is missing', async () => {
      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Question ID is required.');
    });

    it('should emit the correct updated questions when the community exists', async () => {
      const mockCommunity = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Community1',
        questions: [mockQuestion],
      };

      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findOne as jest.Mock).mockResolvedValue({
        ...mockCommunity,
        questions: [mockQuestion],
      });

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /updateCommunityQuestions/:communityName', () => {
    const mockQuestion = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Sample Question',
      text: 'This is a sample question.',
      tags: ['tag1', 'tag2'],
      askedBy: 'user1',
      askDateTime: new Date().toISOString(),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      answers: [],
    };

    const mockCommunity = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Community1',
      questions: [mockQuestion],
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should updated questions and return updatedCommunity', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findOne as jest.Mock).mockResolvedValue({
        ...mockCommunity,
        questions: [mockQuestion],
      });

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
    });

    it('should return 404 if updatedCommunity is not found', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });

    it('should not emit updates if populatedCommunity is null', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /getRelevantCommunities', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    it('should return 400 if tags are missing', async () => {
      const response = await supertest(app).get('/community/getRelevantCommunities');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing tags');
    });

    it('should return 400 if tags is not an array', async () => {
      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: 'tag1' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing tags');
    });

    it('should return a 400 if no matching tags are found', async () => {
      (TagModel.find as jest.Mock).mockResolvedValue([]);

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['nonexistentTag'] });

      expect(response.status).toBe(400);
    });

    it('should return an empty array if no communities match the tags', async () => {
      (TagModel.find as jest.Mock).mockResolvedValue([{ name: 'tag1' }]);
      (CommunityModel.find as jest.Mock).mockResolvedValue([]);

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['tag1'] });

      expect(response.status).toBe(400);
    });

    it('should return a list of community names if matching communities are found', async () => {
      const mockTags = [{ name: 'tag1' }];
      const mockCommunities = [
        { name: 'Community1', tags: ['tag1'] },
        { name: 'Community2', tags: ['tag1'] },
      ];

      (TagModel.find as jest.Mock).mockResolvedValue(mockTags);
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['tag1'] });

      expect(response.status).toBe(400);
    });

    it('should return 400 if an error occurs during database operations', async () => {
      (TagModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: ['tag1'] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing tags');
    });
  });

  describe('PATCH /updateCommunityQuestions/:communityName', () => {
    const mockQuestion = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Sample Question',
      text: 'This is a sample question.',
      tags: ['tag1', 'tag2'],
      askedBy: 'user1',
      askDateTime: new Date().toISOString(),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
      answers: [],
    };

    it('should add a question to a community successfully', async () => {
      const mockCommunity = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Community1',
        questions: [mockQuestion],
      };

      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findOne as jest.Mock).mockResolvedValue({
        ...mockCommunity,
        questions: [mockQuestion],
      });

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
    });

    it('should return 404 if the question is not found', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Question not found.');
    });

    it('should return 404 if the community is not found', async () => {
      (QuestionModel.findById as jest.Mock).mockResolvedValue(mockQuestion);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/NonExistentCommunity')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });

    it('should return 500 if an error occurs during the database query', async () => {
      (QuestionModel.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({ questionId: mockQuestion._id });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating community questions.');
    });

    it('should return 400 if the questionId is missing', async () => {
      const response = await supertest(app)
        .patch('/community/updateCommunityQuestions/Community1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Question ID is required.');
    });
  });

  describe('GET /getRelevantCommunities', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    it('should return relevant communities based on provided tags', async () => {
      const mockTags = ['tag1', 'tag2'];
      const matchingTags = [{ name: 'tag1' }, { name: 'tag2' }];
      const mockCommunities = [
        { name: 'Community1', tags: ['tag1', 'tag2'] },
        { name: 'Community2', tags: ['tag2'] },
      ];
      const expectedCommunityNames = ['Community1', 'Community2'];

      (TagModel.find as jest.Mock).mockResolvedValue(matchingTags);
      (CommunityModel.find as jest.Mock).mockResolvedValue(mockCommunities);

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: mockTags });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedCommunityNames);
    });

    it('should return an empty array if no matching tags are found', async () => {
      const mockTags = ['nonexistent'];
      (TagModel.find as jest.Mock).mockResolvedValue([]);

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: mockTags });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid or missing tags' });
    });

    it('should return a 400 error if tags are missing', async () => {
      const response = await supertest(app).get('/community/getRelevantCommunities').query({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing tags');
    });

    it('should return a 400 error if tags are not an array', async () => {
      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: 'notAnArray' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing tags');
    });

    it('should return a 500 error if there is an error during tag lookup', async () => {
      const mockTags = ['tag1', 'tag2'];
      (TagModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: mockTags });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error fetching relevant communities');
    });

    it('should return a 500 error if there is an error during community lookup', async () => {
      const mockTags = ['tag1', 'tag2'];
      const matchingTags = [{ name: 'tag1' }, { name: 'tag2' }];
      (TagModel.find as jest.Mock).mockResolvedValue(matchingTags);
      (CommunityModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app)
        .get('/community/getRelevantCommunities')
        .query({ tags: mockTags });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error fetching relevant communities');
    });
  });

  describe('GET /getCommunityMembers/:community', () => {
    it('should return members of a community successfully', async () => {
      const mockCommunity = { name: 'Community1', users: ['user1', 'user2'] };

      (CommunityModel.findOne as jest.Mock).mockResolvedValue(mockCommunity);

      const response = await supertest(app).get('/community/getCommunityMembers/Community1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(['user1', 'user2']);
    });

    it('should return 404 if the community is not found', async () => {
      (CommunityModel.findOne as jest.Mock).mockResolvedValue(null);

      const response = await supertest(app).get('/community/getCommunityMembers/NonExistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Community not found');
    });

    it('should return 500 if an error occurs', async () => {
      (CommunityModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await supertest(app).get('/community/getCommunityMembers/Community1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error retrieving questions for the community');
    });
  });
});
