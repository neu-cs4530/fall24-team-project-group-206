import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import TagModel from '../models/tags';

const getTagCountMapSpy: jest.SpyInstance = jest.spyOn(util, 'getTagCountMap');
const findSpy = jest.spyOn(TagModel, 'find');

describe('GET /getTagsWithQuestionNumber', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    getTagCountMapSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return tags with question numbers', async () => {
    const mockTagCountMap = new Map<string, number>();
    mockTagCountMap.set('tag1', 2);
    mockTagCountMap.set('tag2', 1);
    getTagCountMapSpy.mockResolvedValueOnce(mockTagCountMap);

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'tag1', qcnt: 2 },
      { name: 'tag2', qcnt: 1 },
    ]);
  });

  it('should return error 500 if getTagCountMap returns null', async () => {
    getTagCountMapSpy.mockResolvedValueOnce(null);

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);
  });

  it('should return error 500 if getTagCountMap throws an error', async () => {
    getTagCountMapSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);
  });
});

describe('GET /getTagNames', () => {
  afterEach(async () => {
    await mongoose.connection.close();
    findSpy.mockClear();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return all tags', async () => {
    const mockTag1 = { name: 'exampleTag1', description: 'This is test tag 1' };
    const mockTag2 = { name: 'exampleTag2', description: 'This is test tag 2' };

    findSpy.mockResolvedValueOnce([mockTag1, mockTag2]);

    const response = await supertest(app).get('/tag/getTagNames');

    expect(response.body).toEqual([mockTag1, mockTag2]);
  });

  it('should return error 500 if getTagNames throws an error', async () => {
    getTagCountMapSpy.mockRejectedValueOnce(new Error('Failed to retrieve tags'));

    const response = await supertest(app).get('/tag/getTagNames');

    expect(response.status).toBe(500);
  });
  it('should return error 500 if getTagCountMap throws an error', async () => {
    getTagCountMapSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

    const response = await supertest(app).get('/tag/getTagNames');

    expect(response.status).toBe(500);
  });
});
