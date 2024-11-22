/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community, communityRequest, FakeSOSocket } from '../types';
import { usersNewCommunity } from '../models/application';
// import QuestionModel from '../models/questions';

const communityController = (socket: FakeSOSocket) => {
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
  const addUserToCommunity = async (req: Request, res: Response): Promise<void> => {
    // const { username } = req.body; // Expecting the userId and username in the body of the request
    // const { communityName } = req.params; // Get communityId from URL parameter
    const { username, community } = req.body;

    if (!username) {
      res.status(400).json({ message: 'Username and community are required' });
    }

    try {
      // console.log(`Adding user ${username} to community ${community}`);
      // const newCommunity = await usersNewCommunity(username, community);
      console.log(`Removing user ${username} from all communities`);
      await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });

      console.log(`Adding user ${username} to the new community`);
      const newCommunity = await CommunityModel.findOneAndUpdate(
        { name: community },
        { $addToSet: { users: username } },
        { new: true },
      );
      if (!newCommunity) {
        res.status(404).json({ message: 'Community not found' });
      }
      // socket.emit('communityUpdate', {
      //   name,
      //   users: newCommunity.users,
      //   questions: newCommunity.questions,
      //   tags: newCommunity.tags,
      // });

      // if (newCommunity && 'error' in newCommunity ) {
      //   res.status(400).send('Username is already in the community');
      //   return;
      // }

      // await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });
      // const existingCommunity = await CommunityModel.findOne({ users: username });

      // // removes user from existing community
      // if (existingCommunity) {
      //   existingCommunity.users = existingCommunity.users.filter(user => user !== username);
      //   await existingCommunity.save();

      // socket.emit('communityUpdate', {
      //   name: existingCommunity.name,
      //   tags: existingCommunity.tags,
      //   users: existingCommunity.users,
      //   questions: existingCommunity.questions,
      // });

      // // adds user to new community
      // const updatedCommunity = await CommunityModel.findOneAndUpdate(
      //   { name: communityName },
      //   { $addToSet: { users: username } },
      //   { new: true },
      // );

      // // Check if the username is already in the community's users list
      // if (!updatedCommunity) {
      //   res.status(400).send('Username is already in the community');
      //   return;
      // }

      // // emit update for the new community
      // socket.emit('communityUpdate', {
      //   name: updatedCommunity.name,
      //   tags: updatedCommunity.tags,
      //   users: updatedCommunity.users,
      //   questions: updatedCommunity.questions,
      // });

      // console.log(`Added user ${username} to community ${updatedCommunity.name}`);
      console.log(`Added user: ${username} to new community: ${newCommunity}`);
      res.status(200).json('successfully added to the community users list');
      // }
      // // Return the updated community
      // res.json(newCommunity);
    } catch (error) {
      console.error('Error when adding user to community:', error);
      res.status(500).json({ error: 'Failed to add user to community' });
    }
  };

  const getCommunityMembers = async (req: Request, res: Response): Promise<void> => {
    const { community } = req.params;

    try {
      const communityData = await CommunityModel.findOne({ name: community });
      if (!communityData) {
        res.status(404).json({ message: 'Community not found' });
        return;
      }
      console.log(`Retrieved users for community ${community}: ${communityData.users}`);
      res.json(communityData.users);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving questions for the community' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames); // so that we can show all tags in the frontend
  router.get('/getCommunityByName/:name', getCommunityByName);
  // router.patch('/addUserToCommunity/:communityName', addUserToCommunity); // New route for adding user to community
  router.patch('/addUserToCommunity', addUserToCommunity); // New route for adding user to community
  router.get('getCommunityMembers/:community', getCommunityMembers);

  return router;
};

export default communityController;
