/* eslint-disable import/prefer-default-export */
import api from './config';
import { Community, User } from '../types';

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

const updatedUserInCommunity = async (username: string, community: string): Promise<Community> => {
  const res = await api.patch(`${COMMUNITY_API_URL}/addUserToCommunity`, { username, community });
  if (res.status !== 200) {
    throw new Error('Error when adding user to community');
  }
  return res.data;
};

const getCommunityMembers = async (community: string): Promise<User[]> => {
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityMembers/${community}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching community members');
  }
  return res.data;
};

export { getCommunityNames, getCommunityByName, updatedUserInCommunity, getCommunityMembers };
