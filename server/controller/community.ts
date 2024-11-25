import express, { Request, Response, Router } from 'express';
import { ObjectId } from 'mongodb';
import CommunityModel from '../models/communities';
import TagModel from '../models/tags';
import { FakeSOSocket, Question } from '../types';

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
    // console.log(community);

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

  const updateCommunityQuestions = async (req: Request, res: Response): Promise<void> => {
    const { communityName } = req.params;
    const { question } = req.body;

    if (!question || !question.title || !question.text || !question.askedBy) {
      res.status(400).json({ error: 'Invalid question data' });
      return;
    }

    const questionToPush = {
      title: question.title,
      text: question.text,
      tags: question.tags,
      askedBy: question.askedBy,
      askDateTime: question.askDateTime,
      answers: question.answers,
      upVotes: question.upVotes,
      downVotes: question.downVotes,
      views: question.views,
      comments: question.comments,
    };

    try {
      const updatedCommunity = await CommunityModel.findOneAndUpdate(
        { name: communityName },
        { $push: { questions: questionToPush } },
        { new: true, runValidators: true },
      );

      if (!updatedCommunity) {
        res.status(404).json({ error: 'Community not found' });
        return;
      }

      res.json(updatedCommunity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating community questions' });
    }
  };

  router.get('/getCommunityNames', getCommunityNames);
  router.get('/getCommunityQuestions/:community', getCommunityQuestions);
  router.patch('/addUserToCommunity/:communityName', addUserToCommunity);
  router.get('/getRelevantCommunities', getRelevantCommunities);
  router.patch('/updateCommunityQuestions/:communityName', updateCommunityQuestions);

  return router;
};

export default communityController;
