import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Question, Tag } from '../types';

const getQuestionsByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getQuestionsByOrder');
const filterQuestionsBySearchSpy: jest.SpyInstance = jest.spyOn(util, 'filterQuestionsBySearch');

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const EXPECTED_QUESTIONS = MOCK_QUESTIONS.map(question => ({
  ...question,
  _id: question._id?.toString(),
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })),
  askDateTime: question.askDateTime.toISOString(),
}));

describe('Question Controller', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /getQuestion', () => {
    it('should return questions filtered by search and order', async () => {
      getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
      filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_QUESTIONS);

      const response = await supertest(app)
        .get('/question/getQuestion')
        .query({ order: 'someOrder', search: 'someSearch' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(EXPECTED_QUESTIONS);
    });

    it('should return 500 if fetching questions by order fails', async () => {
      getQuestionsByOrderSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .get('/question/getQuestion')
        .query({ order: 'someOrder' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching questions by filter');
    });
  });

  describe('GET /getQuestionById/:qid', () => {
    it('should return 500 if there is an error fetching question by ID', async () => {
      jest
        .spyOn(util, 'fetchAndIncrementQuestionViewsById')
        .mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .get('/question/getQuestionById/507f191e810c19729de860ea')
        .query({ username: 'user1' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching question by id');
    });
  });

  describe('POST /addQuestion', () => {
    it('should return 500 if there is an error saving a question', async () => {
      jest.spyOn(util, 'processTags').mockResolvedValueOnce([
        {
          _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
          name: 'tag1',
          description: 'tag1 description',
        },
      ]);
      jest.spyOn(util, 'saveQuestion').mockRejectedValueOnce(new Error('Save error'));

      const response = await supertest(app)
        .post('/question/addQuestion')
        .send({
          title: 'New Question',
          text: 'Details about the question',
          tags: ['tag1'],
          askedBy: 'user1',
          askDateTime: new Date(),
        });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when saving question');
    });
  });

  describe('PATCH /editQuestion/:qid/:username', () => {
    it('should update the question text successfully', async () => {
      jest.spyOn(mongoose.Model, 'findByIdAndUpdate').mockResolvedValueOnce({
        _id: '507f191e810c19729de860ea',
        text: 'Updated text',
      });

      const response = await supertest(app)
        .patch('/question/editQuestion/507f191e810c19729de860ea/user1')
        .send({ newText: 'Updated text' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Question updated successfully',
        question: {
          _id: '507f191e810c19729de860ea',
          text: 'Updated text',
        },
      });
    });

    it('should return 500 if there is an error updating the question', async () => {
      jest
        .spyOn(mongoose.Model, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .patch('/question/editQuestion/507f191e810c19729de860ea/user1')
        .send({ newText: 'Updated text' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error updating question');
    });
  });

  describe('DELETE /removeQuestion/:qid', () => {
    it('should delete a question successfully', async () => {
      jest.spyOn(mongoose.Model, 'findByIdAndDelete').mockResolvedValueOnce({
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Sample Question',
      });

      const response = await supertest(app)
        .delete('/question/removeQuestion/65e9b58910afe6e94fc6e6dc')
        .send({ community: 'community1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Question successfully deleted',
        question: {
          _id: '65e9b58910afe6e94fc6e6dc',
          title: 'Sample Question',
        },
      });
    });

    it('should return 500 if there is an error removing the question', async () => {
      jest
        .spyOn(mongoose.Model, 'findByIdAndDelete')
        .mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).delete(
        '/question/removeQuestion/507f191e810c19729de860ea',
      );

      expect(response.status).toBe(500);
    });

    it('should return 400 if the question to remove cannot be found', async () => {
      jest.spyOn(mongoose.Model, 'findByIdAndDelete').mockResolvedValueOnce(null);

      const response = await supertest(app).delete(
        '/question/removeQuestion/507f191e810c19729de860ea',
      );

      expect(response.status).toBe(400);
    });
  });

  it('should filter questions by askedBy field', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    jest.spyOn(util, 'filterQuestionsByAskedBy').mockReturnValueOnce([MOCK_QUESTIONS[0]]);

    const response = await supertest(app)
      .get('/question/getQuestion')
      .query({ askedBy: 'question1_user' });

    expect(response.status).toBe(500);
  });

  it('should filter questions when `askedBy` is provided', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    jest.spyOn(util, 'filterQuestionsByAskedBy').mockReturnValueOnce([MOCK_QUESTIONS[0]]);

    const response = await supertest(app)
      .get('/question/getQuestion')
      .query({ askedBy: 'question1_user' });

    expect(response.status).toBe(500);
  });

  it('should handle unknown error in getQuestionsByFilter', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    jest.spyOn(util, 'filterQuestionsBySearch').mockImplementationOnce(() => {
      throw new Error('Unknown error');
    });

    const response = await supertest(app)
      .get('/question/getQuestion')
      .query({ order: 'someOrder', search: 'someSearch' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching questions by filter');
  });

  it('should handle unknown error in getQuestionById', async () => {
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app)
      .get('/question/getQuestionById/507f191e810c19729de860ea')
      .query({ username: 'user1' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question by id');
  });

  it('should handle unknown error in addQuestion', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValueOnce([]);
    jest.spyOn(util, 'saveQuestion').mockRejectedValueOnce(new Error('Save error'));

    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({
        title: 'New Question',
        text: 'Details about the question',
        tags: ['tag1'],
        askedBy: 'user1',
        askDateTime: new Date(),
      });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when saving question');
  });

  it('should return 400 if question body is invalid in addQuestion', async () => {
    const response = await supertest(app).post('/question/addQuestion').send({
      title: '',
      text: '',
      tags: [],
      askedBy: '',
      askDateTime: null,
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Invalid question body');
  });

  it('should handle unknown error when editing a question', async () => {
    jest
      .spyOn(mongoose.Model, 'findByIdAndUpdate')
      .mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app)
      .patch('/question/editQuestion/507f191e810c19729de860ea/user1')
      .send({
        newText: 'Updated text',
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error updating question');
  });

  it('should filter questions when `askedBy` is provided', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    jest.spyOn(util, 'filterQuestionsByAskedBy').mockReturnValueOnce([MOCK_QUESTIONS[0]]);

    const response = await supertest(app)
      .get('/question/getQuestion')
      .query({ askedBy: 'question1_user' });

    expect(response.status).toBe(500);
  });

  it('should return 500 if there is an unknown error in getQuestionsByFilter', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    jest.spyOn(util, 'filterQuestionsBySearch').mockImplementation(() => {
      throw new Error('Unknown error');
    });

    const response = await supertest(app).get('/question/getQuestion').query({ search: 'test' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching questions by filter');
  });
  it('should return 500 if there is an error while fetching question by ID', async () => {
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockRejectedValueOnce(new Error('Database error'));

    const response = await supertest(app)
      .get('/question/getQuestionById/507f191e810c19729de860ea')
      .query({ username: 'test_user' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question by id');
  });

  it('should return 500 if tags are invalid during question creation', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValueOnce([]);
    jest.spyOn(util, 'saveQuestion').mockRejectedValueOnce(new Error('Invalid tags'));

    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({
        title: 'Test Question',
        text: 'Details about the question',
        tags: ['invalidTag'],
        askedBy: 'user1',
        askDateTime: new Date(),
      });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when saving question');
  });

  it('should return 404 if question to edit is not found', async () => {
    jest.spyOn(mongoose.Model, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app)
      .patch('/question/editQuestion/507f191e810c19729de860ea/user1')
      .send({
        newText: 'Updated question text',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Question not found');
  });

  it(
    'should return 500 with a generic error message for an unknown error in ' +
      'getQuestionsByFilter',
    async () => {
      getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
      jest.spyOn(util, 'filterQuestionsBySearch').mockImplementationOnce(() => {
        throw 'Some unknown error'; // Simulate a non-Error object being thrown
      });

      const response = await supertest(app).get('/question/getQuestion').query({ search: 'test' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching questions by filter');
    },
  );

  it('should return 500 if fetchAndIncrementQuestionViewsById fails silently', async () => {
    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    const response = await supertest(app)
      .get('/question/getQuestionById/507f191e810c19729de860ea')
      .query({ username: 'user1' });

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching question by id');
  });
});
