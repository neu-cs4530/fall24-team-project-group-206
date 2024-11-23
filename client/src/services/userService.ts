import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new user to the database.
 *
 * @param user - The user object containing the user's details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 * @returns The created user object from the server response.
 */
const addUser = async (user: User): Promise<User> => {
  try {
    const res = await api.post(`${USER_API_URL}/add`, user);
    if (res.status !== 200) {
      throw new Error('Error while creating a new user');
    }
    return res.data;
  } catch (error) {
    throw new Error(`Error while adding user: ${(error as Error).message}`);
  }
};

const updateUserTags = async (username: string, tags: string[]): Promise<User> => {
  const res = await api.put(`${USER_API_URL}/updateTags`, { username, tags });
  if (res.status !== 200) {
    throw new Error('Failed to update user tags');
  }
  return res.data;
};
const updateUserCommunity = async (username: string, community: string): Promise<User> => {
  const res = await api.put(`${USER_API_URL}/updateCommunity`, { username, community });
  if (res.status !== 200) {
    throw new Error('Failed to update user community');
  }
  return res.data;
};

const getUser = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUser`, { params: { username } });
  if (res.status !== 200) {
    throw new Error('Failed to fetch user data');
  }
  return res.data;
};

const getListOfAllUsers = async (): Promise<User[]> => {
  const res = await api.get(`${USER_API_URL}/getListOfAllUsers`);
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.status !== 200) {
    throw new Error('Failed to fetch user data');
  }
  return [];
};

const increaseUserStatus = async (username: string): Promise<void> => {
  const res = await api.put(`${USER_API_URL}/increaseUserStatus`, { username });
  if (res.status !== 200) {
    throw new Error('Failed to fetch user data');
  }
};

export {
  addUser,
  updateUserTags,
  updateUserCommunity,
  getUser,
  getListOfAllUsers,
  increaseUserStatus,
};
