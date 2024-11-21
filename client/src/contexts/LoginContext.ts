import { createContext } from 'react';
import { User } from '../types';
import { Dispatch, SetStateAction } from 'react';

export interface LoginContextType {
  setUser: Dispatch<SetStateAction<User>>; // Allow proper use of React's state updater
}

// Initialize the context with a placeholder value (e.g., null) that matches the type
const LoginContext = createContext<LoginContextType | null>(null);

export default LoginContext;