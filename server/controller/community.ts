import express, { Request, Response, Router } from 'express';
import CommunityModel from '../models/communities';
import TagModel from '../models/tags';
import { FakeSOSocket } from '../types';

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

  const getCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { community } = req.params;

    try {
      const communityData = await CommunityModel.findOne({ name: community }).populate('questions');
      if (!communityData) {
        res.status(404).json({ error: 'Community not found' });
        return;
      }

      res.json(communityData.questions);

      // socket.emit('communityUpdate', {
      //   community,
      //   questions: communityData.questions,
      // });
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving questions for the community' });
    }
  };

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
        return;
      }

      community.users.push(username);
      await community.save();

      res.json(community);

      // socket.emit('userAddedToCommunity', {
      //   community: communityName,
      //   username,
      // });
    } catch (error) {
      res.status(500).json({ error: 'Error when adding user to community' });
    }
  };

  const getRelevantCommunities = async (req: Request, res: Response): Promise<void> => {
    const { tags } = req.query;

    if (!tags || !Array.isArray(tags)) {
      res.status(400).json({ error: 'Invalid or missing tags' });
      return;
    }

    try {
      // Find matching tags in the Tag model
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

  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityQuestions/:community', getCommunityQuestions);
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity);
  router.get('/getRelevantCommunities', getRelevantCommunities);

  return router;
};

export default communityController;
