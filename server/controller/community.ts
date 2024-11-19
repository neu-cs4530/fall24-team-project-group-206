/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community } from '../types';
// import QuestionModel from '../models/questions';

const communityController = () => {
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
      const communities = await CommunityModel.find({});
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  const getCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { community } = req.params;

    try {
      const communityData = await CommunityModel.findOne({ name: community }).populate('questions');
      if (!communityData) {
        res.status(404).json({ error: 'Community not found' });
        console.log('here, was null');
        return;
      }
      console.log(communityData.questions);

      res.json(communityData.questions);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving questions for the community' });
    }
  };

  /**
   * Adds a user's username to the community.
   * This function will update the community model by adding the username to the community's list of users.
   */
  const addUserToCommunity = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body;
    const { communityName } = req.params;

    try {
      const community = await CommunityModel.findById(communityName);

      if (!community) {
        res.status(404).send('Community not found');
        return;
      }

      if (community.users.includes(username)) {
        res.status(400).send('Username is already in the community');
      }

      community.users.push(username);
      await community.save();

      res.json(community);
    } catch (error) {
      res.status(500).json({ error: 'Error when adding user to community' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityQuestions/:community', getCommunityQuestions);
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity);
  return router;
};

export default communityController;
