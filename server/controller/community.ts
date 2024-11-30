/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community, FakeSOSocket, Question } from '../types';
import TagModel from '../models/tags';
import QuestionModel from '../models/questions';
import { sortQuestionsByNewest } from '../models/application';

const communityController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Returns all the communities from the Database.
   * @param req The Request object that contains the communities.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to void.
   */
  const getCommunityNames = async (req: Request, res: Response): Promise<void> => {
    try {
      const communities = await CommunityModel.find({});
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  /**
   * Finds a Community by Name.
   * @param name The Request object with the community name.
   * @returns The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to Community or null if not found.
   */
  // const getCommunityByName = async (name: string): Promise<Community | null> => {
  //   try {
  //     const community = await CommunityModel.findOne({ name }).populate('questions');
  //     if (!community) {
  //       return null;
  //     }
  //     if (!community.questions || community.questions.length === 0) {
  //       console.log('No questions available for this community.');
  //       return { ...community.toObject(), questions: [] };
  //     }
  //     // Return the community with populated question data
  //     return { ...community.toObject(), questions: community.questions };
  //   } catch (error) {
  //     console.error('Error fetching community by name:', error);
  //     throw error;
  //   }
  // };

  /**
   * Gets the questionss of a Commubnity.
   *
   * @param req The Request object that contains the Community.
   * @param res The HTTP response object used to send back the filtered list of questions.
   *
   * @returns A Promise that resolves to a void.
   */
  const getCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { community } = req.params;

    try {
      const communityData = await CommunityModel.findOne({ name: community }).populate({
        path: 'questions',
        populate: [
          { path: 'tags', model: 'Tag' },
          { path: 'answers', model: 'Answer' },
        ],
      });
      // console.log(communityData);
      if (!communityData) {
        res.status(404).json({ error: 'Community not found' });
        return;
      }

      res.json(sortQuestionsByNewest(communityData.questions as Question[]));
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving questions for the community' });
    }
  };

  /**
   * Adds the username to the Community.
   * @param req The Request object that contains a username and a community name.
   * @param res The HTTP response object used to add the username to the community.
   *
   * @returns A Promise that resolves to a void.
   */
  const addUserToCommunity = async (req: Request, res: Response): Promise<void> => {
    const { username, community } = req.body;

    if (!username) {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    try {
      if (!community) {
        console.log(`No community selected. Removing user ${username} from all communities.`);
        const communitiesAffectedByRemoval = await CommunityModel.find({ users: username });
        await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });
        console.log(`${username} removed from all communities.`);

        communitiesAffectedByRemoval.forEach(comm => {
          socket.emit('communityUpdate', {
            name: comm.name,
            users: comm.users.filter(user => user !== username),
          });
        });
        res.status(200).json({ message: 'User removed from all communities successfully' });
        return;
      }
      console.log(`Removing user ${username} from all communities`);
      const communitiesAffected = await CommunityModel.find({ users: username });
      await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });

      communitiesAffected.forEach(comm => {
        socket.emit('communityUpdate', {
          name: comm.name,
          users: comm.users.filter(user => user !== username),
        });
      });

      console.log(`Adding user ${username} to the new community`);
      const newCommunity = await CommunityModel.findOneAndUpdate(
        { name: community },
        { $addToSet: { users: username } },
        { new: true },
      );
      if (!newCommunity) {
        res.status(404).json({ message: 'Community not found' });
        return;
      }
      socket.emit('communityUpdate', {
        name: newCommunity.name,
        users: newCommunity.users,
      });
      console.log(`Added user: ${username} to new community: ${newCommunity}`);
      res.status(200).json('successfully added to the community users list');
    } catch (error) {
      console.error('Error when adding user to community:', error);
      res.status(500).json({ error: 'Failed to add user to community' });
    }
  };

  /**
   * Finds the relavant communities based on the tags.
   * @param req The Request object that contains tags.
   * @param res The HTTP response object used to find the relevant communties based on the tags.
   *
   * @returns A Promise that resolves to a void.
   */
  const getRelevantCommunities = async (req: Request, res: Response): Promise<void> => {
    const { tags } = req.query;

    if (!tags || !Array.isArray(tags)) {
      res.status(400).json({ error: 'Invalid or missing tags' });
      return;
    }

    try {
      const matchingTags = await TagModel.find({ name: { $in: tags } });

      if (matchingTags.length === 0) {
        res.json([]);
        return;
      }

      const tagNames = matchingTags.map(tag => tag.name);
      const communities = await CommunityModel.find({ tags: { $in: tagNames } });
      const communityNames = communities.map(community => community.name);
      res.json(communityNames);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching relevant communities' });
    }
  };

  /**
   * Updates the Questions in a Community.
   * @param req The Request object that updates the Community with a new Question.
   * @param res The HTTP response object used to add questions to communities.
   * @returns A Promise that resolves to a void.
   */
  const updateCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { communityName } = req.params;
    const { questionId } = req.body;

    if (!questionId) {
      res.status(400).json({ error: 'Question ID is required.' });
      return;
    }

    try {
      const existingQuestion = await QuestionModel.findById(questionId);

      if (!existingQuestion) {
        res.status(404).json({ error: 'Question not found.' });
        return;
      }

      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        { name: communityName },
        { $addToSet: { questions: existingQuestion as Question } },
        { new: true, runValidators: true },
      );

      const populatedCommunity = await CommunityModel.findOne({ name: communityName }).populate({
        path: 'questions',
        populate: [
          { path: 'tags', model: 'Tag' },
          { path: 'answers', model: 'Answer' },
        ],
      });

      // console.log(populatedCommunity);
      if (populatedCommunity) {
        console.log(populatedCommunity.questions);
        socket.emit('communityQuestionUpdate', {
          name: communityName,
          questions: populatedCommunity.questions as Question[],
        });
      }

      if (!updatedCommunity) {
        res.status(404).json({ error: 'Community not found.' });
        return;
      }

      res.json(updatedCommunity);
    } catch (error: unknown) {
      res.status(500).json({ error: 'Error updating community questions.' });
    }
  };

  /**
   * Finds all the members in a community.
   * @param req The Request object containinng the community name.
   * @param res The HTTP response object used to find the members of a community.
   *
   * @returns A Promise that resolves to a void.
   */
  const getCommunityMembers = async (req: Request, res: Response): Promise<void> => {
    const { community } = req.params;
    console.log(`Received request to get members of community: ${community}`);

    try {
      const communityData = await CommunityModel.findOne({ name: community });
      if (!communityData) {
        console.log(`Community not found: ${community}`);
        res.status(404).json({ message: 'Community not found' });
        return;
      }
      console.log(`Retrieved users for community ${community}: ${communityData.users}`);
      res.status(200).json(communityData.users);
    } catch (error) {
      console.error('Error retrieving users for the community:', error);
      res.status(500).json({ error: 'Error retrieving questions for the community' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames);
  // router.get('/getCommunityByName/:name', getCommunityByName);
  router.get('/getCommunityQuestions/:community', getCommunityQuestions);
  router.get('/getCommunityMembers/:community', getCommunityMembers);
  router.get('/getRelevantCommunities', getRelevantCommunities);
  router.patch('/addUserToCommunity', addUserToCommunity);
  router.patch('/updateCommunityQuestions/:communityName', updateCommunityQuestions);

  return router;
};

export default communityController;
