import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import TagModel from '../models/tags';

const getTagCountMapSpy: jest.SpyInstance = jest.spyOn(util, 'getTagCountMap');

describe('GET /getTagsWithQuestionNumber', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
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
  })
  

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

  describe('GET /tags/getTagNames', () => {
    it('should retrieve all tags successfully', async () => {
      const mockTags = [
        { _id: '1', name: 'tag1' },
        { _id: '2', name: 'tag2' },
      ];
  
      (TagModel.find as jest.Mock).mockResolvedValue(mockTags);
  
      const response = await supertest(app).get('/tags/getTagNames');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTags);
    });
  
    it('should return 500 if there is an error retrieving tags', async () => {
      (TagModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      const response = await supertest(app).get('/tags/getTagNames');
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve tags');
    });
  
    it('should return an empty list if no tags are available', async () => {
      (TagModel.find as jest.Mock).mockResolvedValue([]);
  
      const response = await supertest(app).get('/tags/getTagNames');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
  

});
