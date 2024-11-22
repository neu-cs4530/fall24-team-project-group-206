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
  console.log('got her yay');
  const res = await api.get(`${COMMUNITY_API_URL}/getCommunityByName/${name}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching community by name');
  }
  return res.data;
};

const updatedUserCommunity = async (
  username: string,
  communityName: string,
): Promise<Community> => {
  console.log('got here');
  const res = await api.patch(`${COMMUNITY_API_URL}/addUserToCommunity/${communityName}`, {
    username,
  });
  if (res.status !== 200) {
    throw new Error('Error when adding user to community');
  }
  return res.data;
};

export { getCommunityNames, getCommunityByName, updatedUserCommunity };
