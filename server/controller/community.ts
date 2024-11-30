/* eslint-disable no-console */
import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import { Community, FakeSOSocket, Question } from '../types';
import TagModel from '../models/tags';
import QuestionModel from '../models/questions';
import { sortQuestionsByNewest } from '../models/application';

const communityController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  const getCommunityNames = async (req: Request, res: Response): Promise<void> => {
    try {
      const communities = await CommunityModel.find({});
      res.json(communities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve communities' });
    }
  };

  const getCommunityByName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    try {
      const community = await CommunityModel.findOne({ name }).populate('questions');
      if (!community) {
        res.status(404).json({ error: 'Community not found' });
        return;
      }
      if (!community.questions || community.questions.length === 0) {
        console.log('No questions available for this community.');
        res.json({ ...community.toObject(), questions: [] });
        return;
      }
      res.json({ ...community.toObject(), questions: community.questions });
    } catch (error) {
      console.error('Error fetching community by name:', error);
      res.status(500).json({ error: 'Error fetching community by name' });
    }
  };

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
  
      if (!communityData) {
       res.status(404).json({ error: 'Community not found' });
       return;
      }
  
      res.status(200).json(communityData.questions);
      return;
    } catch (error) {
      console.error('Error retrieving questions for the community:', error);
      res.status(500).json({ error: 'Error retrieving questions for the community' })
      return;
    }
  };
  
  const addUserToCommunity = async (req: Request, res: Response): Promise<void> => {
    const { username, community } = req.body;

    if (!username) {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    try {
      if (!community) {
        const communitiesAffectedByRemoval = await CommunityModel.find({ users: username });
        await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });

        communitiesAffectedByRemoval.forEach((comm) => {
          socket.emit('communityUpdate', {
            name: comm.name,
            users: comm.users.filter((user) => user !== username),
          });
        });
        res.status(200).json({ message: 'User removed from all communities successfully' });
        return;
      }

      const communitiesAffected = await CommunityModel.find({ users: username });
      await CommunityModel.updateMany({ users: username }, { $pull: { users: username } });

      communitiesAffected.forEach((comm) => {
        socket.emit('communityUpdate', {
          name: comm.name,
          users: comm.users.filter((user) => user !== username),
        });
      });

      const newCommunity = await CommunityModel.findOneAndUpdate(
        { name: community },
        { $addToSet: { users: username } },
        { new: true }
      );
      if (!newCommunity) {
        res.status(404).json({ message: 'Community not found' });
        return;
      }
      socket.emit('communityUpdate', {
        name: newCommunity.name,
        users: newCommunity.users,
      });
      res.status(200).json('successfully added to the community users list');
    } catch (error) {
      res.status(500).json({ error: 'Failed to add user to community' });
    }
  };

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

      const tagNames = matchingTags.map((tag) => tag.name);
      const communities = await CommunityModel.find({ tags: { $in: tagNames } });
      const communityNames = communities.map((community) => community.name);
      res.json(communityNames);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching relevant communities' });
    }
  };

  const updateCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { communityName } = req.params;
    const { questionId } = req.body;

    if (!questionId) {
      res.status(400).json({ error: 'Question ID is required.' });
      return;
    }

    try {
      const question = await QuestionModel.findById(questionId);

      if (!question) {
        res.status(404).json({ error: 'Question not found.' });
        return;
      }

      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        { name: communityName },
        { $addToSet: { questions: question._id } },
        { new: true }
      );

      if (!updatedCommunity) {
        res.status(404).json({ error: 'Community not found.' });
        return;
      }

      const populatedCommunity = await CommunityModel.findOne({ name: communityName }).populate({
        path: 'questions',
        populate: [
          { path: 'tags', model: 'Tag' },
          { path: 'answers', model: 'Answer' },
        ],
      });

      if (populatedCommunity && Array.isArray(populatedCommunity.questions)) {
        socket.emit('communityQuestionUpdate', {
          name: communityName,
          questions: populatedCommunity.questions as Question[],
        });
      }

      res.json(updatedCommunity);
    } catch (error) {
      res.status(500).json({ error: 'Error updating community questions.' });
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
      res.status(200).json(communityData.users);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving community members' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityQuestions/:community', getCommunityQuestions);
  router.get('/getCommunityByName/:name', getCommunityByName);
  router.get('/getCommunityMembers/:community', getCommunityMembers);
  router.get('/getRelevantCommunities', getRelevantCommunities);
  router.patch('/addUserToCommunity', addUserToCommunity);
  router.patch('/updateCommunityQuestions/:communityName', updateCommunityQuestions);

  return router;
};

export default communityController;
