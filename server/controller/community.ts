/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community, CommunityRequest } from '../types';
// import QuestionModel from '../models/questions';
import { addUserToCommunity } from '../models/application';

const communityController = () => {
  const router: Router = express.Router();

  const addUser = async (req: Request, res: Response): Promise<void> => {
    addUserToCommunity(req, res, 'add');
  };

  const removeUser = async (req: Request, res: Response): Promise<void> => {
    addUserToCommunity(req, res, 'remove');
  };

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
   * Helper function to handle upvoting or downvoting a question.
   *
   * @param req The VoteRequest object containing the question ID and the username.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of vote to perform (upvote or downvote).
   *
   * @returns A Promise that resolves to void.
   */
  const addUserToCommunity = async (
    req: CommunityRequest,
    res: Response,
    type: 'add' | 'remove',
  ): Promise<void> => {
    if (!req.body.id || !req.body.name) {
      res.status(400).send('Invalid request');
      return;
    }

    const { id, name } = req.body;

    try {
      let status;
      if (type === 'add') {
        status = await addUserToCommunity(id, name, type);
      } else {
        status = await addUserToCommunity(id, name, 'remove');
      }

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Emit the updated vote counts to all connected clients
      socket.emit('voteUpdate', { id, users: status.users });
      res.json({ msg: status.msg, users: status.users });
    } catch (err) {
      res.status(500).send(`Error when ${type}ing: ${(err as Error).message}`);
    }
  };

  router.get('/getCommunityNames', getCommunityNames); // so that we can show all tags in the frontend
  router.get('/getCommunityByName/:name', getCommunityByName);
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity); // New route for adding user to community

  return router;
};

export default communityController;
