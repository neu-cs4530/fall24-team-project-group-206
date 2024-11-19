/* eslint-disable import/prefer-default-export */
import api from './config';
import { Community, Question } from '../types';

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

const addUserToCommunity = async (username: string, communityName: string): Promise<Community> => {
  const res = await api.put(`${COMMUNITY_API_URL}/addUserToCommunity/${communityName}`, username);
  if (res.status !== 200) {
    throw new Error('Error when adding user to community');
  }
  return res.data;
};

export { getCommunityNames, getCommunityQuestions, addUserToCommunity };
