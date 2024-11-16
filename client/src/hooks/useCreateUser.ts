/* eslint-disable import/no-extraneous-dependencies */
import { ChangeEvent, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle user creation input and submission.
 *
 * @returns email - The current value of the email input.
 * @returns password - The current value of the password input.
 * @returns errorMessage - The current error message.
 * @returns isLoading - The current loading state.
 * @returns handleEmailChange - Function to handle changes in the email input field.
 * @returns handlePasswordChange - Function to handle changes in the password input field.
 * @returns handleSubmit - Function to handle user creation submission
 */
const useCreateUser = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      // setUser({ username: user.email ?? '', status: 'low' });
      // navigate('/home');
      navigate('/new/tagselection');
    } catch (error) {
      setErrorMessage((error as Error).message);
      setIsLoading(false);
    }
  };

  return {
    email,
    firstName,
    lastName,
    password,
    errorMessage,
    isLoading,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useCreateUser;
