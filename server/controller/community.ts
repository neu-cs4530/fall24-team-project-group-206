/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community } from '../types';
import {FakeSOSocket } from '../types';

import { Socket } from 'socket.io';
import { ObjectId } from 'mongodb';
// import QuestionModel from '../models/questions';

const communityController = (socket: FakeSOSocket)=> {
  const router: Router = express.Router();


  /**
   * Retrieves a list of tags along with the number of questions associated with each tag.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param _ The HTTP request object (not used in this function).
   * @param res The HTTP response object used to send back the tag count mapping.
   *
   * @returns A Promise that resolves to void.
   */
  /**
   * @param req The Request object containing the tag name in the URL parameters.
   * @param res The HTTP response object used to send back the result of the operation.
   */
  const getCommunityNames = async (req: Request, res: Response): Promise<void> => {
    try {
      const communities = await CommunityModel.find({}); // Retrieve only necessary fields
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  // const getCommunityByName = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const { name } = req.params;
  //     const community = await CommunityModel.findOne({ name });

  //     if (!community) {
  //       res.status(404).send(`Community with name "${name}" not found`);
  //     } else {
  //       res.json(community); // Return the community as JSON
  //     }
  //   } catch (err) {
  //     res.status(500).send(`Error when fetching community: ${(err as Error).message}`);
  //   }
  // };

  const getCommunityByName = async (name: string): Promise<Community | null> => {
    try {
      const community = await CommunityModel.findOne({ name }).populate('questions');
      if (!community) {
        return null;
      }
      if (!community.questions || community.questions.length === 0) {
        console.log('No questions available for this community.');
        return { ...community.toObject(), questions: [] };
      }
      // Return the community with populated question data
      return { ...community.toObject(), questions: community.questions };
    } catch (error) {
      console.error('Error fetching community by name:', error);
      throw error;
    }
  };

  /**
   * Adds a user's username to the community.
   * This function will update the community model by adding the username to the community's list of users.
   */
  const addUserToCommunity = (socket: FakeSOSocket) => async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body; // Extract username from the request body
    const { communityName } = req.params; // Extract community name from the URL parameter
  
    try {
      // Find the community by name
      const community = await CommunityModel.findOne({ name: communityName });
  
      if (!community) {
        res.status(404).json({ error: 'Community not found' });
        return;
      }
  
      // Check if the user is already in the community
      if (community.users.includes(username)) {
        res.status(400).json({ error: 'User already exists in the community' });
        return;
      }
  
      // Add the user to the `users` array
      community.users.push(username);
  
      // Save the updated community to the database
      const updatedCommunity = await community.save();
  
      // Emit a `communityUpdate` event via Socket.IO
      socket.emit('communityUpdate', {
        name: updatedCommunity.name, // Community name
        tags: updatedCommunity.tags, // Community tags
        users: updatedCommunity.users, // Updated list of users
        questions: updatedCommunity.questions, // Associated questions
      });
  
      // Respond with the updated community
      res.status(200).json(updatedCommunity);
    } catch (error) {
      console.error('Error adding user to community:', error);
      res.status(500).json({ error: 'Failed to add user to community' });
    }
  };
  
  
  

  
  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityByName/:name', getCommunityByName);
  // Add user to community with socket integration
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity(socket));


  return router;
};

export default communityController;
