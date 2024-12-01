// import mongoose from 'mongoose';
// import supertest from 'supertest';
// import { app } from '../app';
// import * as util from '../models/application';
// import { Answer, Community, Question, Tag } from '../types';
// import Communities from '../models/communities';
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const mockingoose = require('mockingoose');

// const tag1: Tag = {
//   _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
//   name: 'tag1',
//   description: 'tag1 description',
// };
// const tag2: Tag = {
//   _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
//   name: 'tag2',
//   description: 'tag2 description',
// };

// const mockCommunity: Community = {
//   _id: new mongoose.Types.ObjectId('674a9019ac7bc8b100a70f13'),
//   name: 'New Community',
//   tags: ['react', 'typescript'],
//   users: ['lizzie', 'kristen', 'pooja'],
//   questions: [],
// };

// describe('POST /getCommunityNames', () => {
//   afterEach(async () => {
//     await mongoose.connection.close(); // Ensure the connection is properly closed
//   });

//   afterAll(async () => {
//     await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
//   });
//   it('should return 200 if getCommunityNames is successful', async () => {
//     mockingoose(Communities).toReturn([mockCommunity], 'find');

//     // Making the request
//     const response = await supertest(app).post('/community/getCommunityNames');

//     // Asserting the response
//     expect(response.status).toBe(200);
//     expect(response.body.users).toEqual(['New Community']);
//   });
//   it(
//     'should return 404 if error occurs in getCommunityNames while getting a community' +
//       ' that exists',
//     async () => {
//       jest
//         .spyOn(util, 'populateDocument')
//         .mockResolvedValueOnce({ error: 'Error while populating' });

//       // Making the request
//       const response = await supertest(app).post('/community/getCommunityNames');

//       // Asserting the response
//       expect(response.status).toBe(404);
//     },
//   );
//   it(
//     'should return 500 if error occurs in getCommunityNames while getting a community' +
//       ' that exists',
//     async () => {
//       mockingoose(Communities).toReturn(null, 'find');

//       // Making the request
//       const response = await supertest(app).post('/community/getCommunityNames');

//       // Asserting the response
//       expect(response.status).toBe(404);
//     },
//   );
// });
// describe('POST /getCommunityNames', () => {
//   afterEach(async () => {
//     await mongoose.connection.close(); // Ensure the connection is properly closed
//   });

//   afterAll(async () => {
//     await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
//   });
//   it('should return 200 if getCommunityNames is successful', async () => {
//     mockingoose(Communities).toReturn([mockCommunity], 'find');

//     // Making the request
//     const response = await supertest(app).post('/community/getCommunityNames');
//     console.log(response.status);
//     console.log(response.body);

//     // Asserting the response
//     expect(response.status).toBe(200);
//     expect(response.body.users).toEqual(['New Community']);
//   });
//   it(
//     'should return 404 if error occurs in getCommunityNames while getting a community' +
//       ' that exists',
//     async () => {
//       jest
//         .spyOn(util, 'populateDocument')
//         .mockResolvedValueOnce({ error: 'Error while populating' });

//       // Making the request
//       const response = await supertest(app).post('/community/getCommunityNames');

//       // Asserting the response
//       expect(response.status).toBe(404);
//     },
//   );
//   it(
//     'should return 500 if error occurs in getCommunityNames while getting a community' +
//       ' that exists',
//     async () => {
//       mockingoose(Communities).toReturn(null, 'find');

//       // Making the request
//       const response = await supertest(app).post('/community/getCommunityNames');

//       // Asserting the response
//       expect(response.status).toBe(404);
//     },
//   );
// });
// describe('GET /getCommunityQuestions', () => {
//   it('should return a community by its name', async () => {
//     mockingoose(Communities).toReturn(mockCommunity, 'findOne');
//     const response = await supertest(app).get(
//       `/community/getCommunityQuestions/${mockCommunity.name}`,
//     );
//     console.log('Mocked Data:', JSON.stringify(mockCommunity, null, 2));

//     console.log(response.status);
//     console.log(JSON.stringify(response.body));
//     expect(response.status).toBe(200);
//     expect(response.body.name).toBe(mockCommunity.name);
//   });

//   it('should return 404 if the community is not found', async () => {
//     const response = await supertest(app).get(
//       '/community/getCommunityQuestions/NonexistentCommunity',
//     );
//     expect(response.status).toBe(500);
//   });

//   it('should return 500 if there is a server error', async () => {
//     mockingoose(Communities).toReturn(mockCommunity, 'findOne');
//     jest.spyOn(util, 'populateDocument').mockResolvedValueOnce({ error: 'Error while populating' });
//     const response = await supertest(app).get(
//       `/community/getCommunityQuestions/${mockCommunity.name}`,
//     );
//     expect(response.status).toBe(500);
//   });
// });
