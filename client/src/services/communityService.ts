/* eslint-disable import/prefer-default-export */
import axios, { AxiosError } from 'axios';
import api from './config';
import { Community } from '../types';

const COMMUNITY_API_URL = `${process.env.REACT_APP_SERVER_URL}/community`;

/**
 * Fetches the names of all communities.
 * @returns A list of community objects.
 * @throws An error if the API call fails or returns a non-200 status.
 */
const getCommunityNames = async (): Promise<Community[]> => {
  try {
    const res = await api.get(`${COMMUNITY_API_URL}/getCommunityNames`);
    if (res.status !== 200) {
      throw new Error('Error when fetching community names');
    }
    return res.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Error in getCommunityNames:', axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
};

/**
 * Fetches the details of a specific community by name.
 * @param name - The name of the community.
 * @returns The community object.
 * @throws An error if the API call fails or the community is not found.
 */
const getCommunityByName = async (name: string): Promise<Community> => {
  try {
    // Encode the name to handle spaces or special characters
    const encodedName = encodeURIComponent(name);
    const res = await api.get(`${COMMUNITY_API_URL}/getCommunityByName/${encodedName}`);
    
    if (res.status !== 200) {
      throw new Error('Error when fetching community by name');
    }
    return res.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Error in getCommunityByName:', axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
};


/**
 * Adds a user to a community.
 * @param communityName - The name of the community.
 * @param username - The username of the user to add.
 * @returns The updated community object.
 * @throws An error if the API call fails or the user cannot be added.
 */
const addUserToCommunity = async (communityName: string, username: string) => {
  try {
    const encodedCommunityName = encodeURIComponent(communityName); // Encode community name
    const response = await axios.patch(
      `${COMMUNITY_API_URL}/addUserToCommunity/${encodedCommunityName}`,
      { username }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error in addUserToCommunity:', axiosError.response?.data || axiosError.message);
    throw axiosError; // Throw the error to be caught in saveCommunityAndContinue
  }
};




export { getCommunityNames, getCommunityByName, addUserToCommunity };
