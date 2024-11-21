import { createContext } from 'react';
import { FakeSOSocket, User } from '../types';

/**
 * Interface represents the context type for user-related data and a WebSocket connection.
 *
 * - user - the current user (non-nullable).
 * - setUser - function to update the current user.
 * - socket - the WebSocket connection (non-nullable).
 */
export interface UserContextType {
  user: User; // Ensure user is never null
  setUser: React.Dispatch<React.SetStateAction<User>>;
  socket: FakeSOSocket; // Ensure socket is never null
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
