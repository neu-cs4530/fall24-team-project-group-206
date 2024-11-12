import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import TagModel from '../models/tags';
import { getTagCountMap } from '../models/application';
import * as util from '../models/application';

const getTagCountMapSpy = jest.spyOn(util, 'getTagCountMap');

describe('Tag Controller Endpoints', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /getTagsWithQuestionNumber', () => {
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

    it('should return error 500 if getTagCountMap throws an error', async () => {
      getTagCountMapSpy.mockRejectedValueOnce(new Error('Error fetching tags'));

      const response = await supertest(app).get('/tag/getTagsWithQuestionNumber');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching tag count map');
    });
  });

  describe('GET /getTagByName/:name', () => {
    it('should return a tag by name', async () => {
      const mockTag = { name: 'tag1' };
      jest.spyOn(TagModel, 'findOne').mockResolvedValueOnce(mockTag);

      const response = await supertest(app).get('/tag/getTagByName/tag1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTag);
    });

    it('should return 404 if tag not found', async () => {
      jest.spyOn(TagModel, 'findOne').mockResolvedValueOnce(null);

      const response = await supertest(app).get('/tag/getTagByName/nonexistent');

      expect(response.status).toBe(404);
      expect(response.text).toContain('Tag with name "nonexistent" not found');
    });

    it('should return error 500 if there is an issue fetching the tag', async () => {
      jest.spyOn(TagModel, 'findOne').mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).get('/tag/getTagByName/tag1');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when fetching tag');
    });
  });

  describe('GET /getTagNames', () => {
    it('should return a list of tag names', async () => {
      const mockTags = [{ name: 'tag1' }, { name: 'tag2' }];
      jest.spyOn(TagModel, 'find').mockResolvedValueOnce(mockTags);

      const response = await supertest(app).get('/tag/getTagNames');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTags);
    });

    it('should return error 500 if there is an issue retrieving tags', async () => {
      jest.spyOn(TagModel, 'find').mockRejectedValueOnce(new Error('Error fetching tags'));

      const response = await supertest(app).get('/tag/getTagNames');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to retrieve tags' });
    });
  });
});
