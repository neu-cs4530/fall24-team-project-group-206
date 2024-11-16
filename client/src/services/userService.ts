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

export default addUser;
