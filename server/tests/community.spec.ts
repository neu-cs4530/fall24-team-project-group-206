import request from 'supertest'; 
import express, { Application } from 'express';
import communityController from '../controller/community';
import CommunityModel from '../models/communities';

jest.mock('../models/communities');

describe('Community Controller - getCommunityNames', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/community', communityController()); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return a list of communities', async () => {
    const mockCommunities = [
      { name: 'Community1', description: 'This is Community1' },
      { name: 'Community2', description: 'This is Community2' },
    ];
    (CommunityModel.find as jest.Mock).mockResolvedValueOnce(mockCommunities);

    const response = await request(app).get('/community/getCommunityNames');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCommunities);
    expect(CommunityModel.find).toHaveBeenCalledTimes(1); 
  });

  it('should return a 500 status if an error occurs', async () => {
    (CommunityModel.find as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/community/getCommunityNames');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to retrieve communities' });
    expect(CommunityModel.find).toHaveBeenCalledTimes(1); 
  });
});
