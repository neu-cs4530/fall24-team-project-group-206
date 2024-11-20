/* eslint-disable import/prefer-default-export */
import api from './config';
import { Community } from '../types';

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

const getCommunityByName = async (name: string): Promise<Community> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityByName/${name}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching community by name');
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

/**
 * Fetches relevant communities based on user tags.
 * @param tags - An array of tag names.
 * @returns An array of `Community` objects.
 */
const getRelevantCommunities = async (tags: string[]): Promise<string[]> => {
  const res = await api.post(`${COMMUNITY_API_URL}/relevant-communities`, { tags });
  if (res.status !== 200) {
    throw new Error('Error when fetching relevant communities');
  }
  return res.data;
};

export { getCommunityNames, getCommunityByName, addUserToCommunity, getRelevantCommunities };
