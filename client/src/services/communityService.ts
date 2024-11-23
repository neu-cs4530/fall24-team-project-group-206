/* eslint-disable import/prefer-default-export */
import api from './config';
import { Community, Question, User } from '../types';

const COMMUNITY_API_URL = `${process.env.REACT_APP_SERVER_URL}/community`;

/**
 * ADD TESTS??????
 * @returns names of communities
 */
const getCommunityNames = async (): Promise<Community[]> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityNames`);
  if (res.status !== 200) {
    throw new Error(`Error when fetching community names`);
  }
  return res.data;
};

const getCommunityQuestions = async (community: string): Promise<Question[]> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityQuestions/${community}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching community questions');
  }
  return res.data;
};

const getRelevantCommunities = async (tags: string[]): Promise<string[]> => {
  console.log('made it to the service');
  try {
    const res = await api.get(`${COMMUNITY_API_URL}/getRelevantCommunities`, {
      params: { tags },
    });

    if (res.status !== 200) {
      throw new Error('Error when fetching relevant communities');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when fetching relevant communities');
  }
};

const updatedUserInCommunity = async (username: string, community: string): Promise<Community> => {
  const res = await api.patch(`${COMMUNITY_API_URL}/addUserToCommunity`, { username, community });
  if (res.status !== 200) {
    throw new Error('Error when adding user to community');
  }
  return res.data;
};

const getCommunityMembers = async (community: string): Promise<string[]> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityMembers/${community}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching community members');
  }
  return res.data;
};

export {
  getCommunityNames,
  getCommunityQuestions,
  getRelevantCommunities,
  updatedUserInCommunity,
  getCommunityMembers,
};
