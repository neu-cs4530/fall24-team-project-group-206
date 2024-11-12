/* eslint-disable import/no-extraneous-dependencies */
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import useLoginContext from './useLoginContext';
import { auth } from '../firebaseConfig';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns email - The current value of the email input.
 * @returns password - The current value of the password input.
 * @returns errorMessage - The current error message.
 * @returns handleEmailChange - Function to handle changes in the email input field.
 * @returns handlePasswordChange - Function to handle changes in the password input field.
 * @returns handleSubmit - Function to handle user login submission
 */
const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser({ username: user.email ?? '', status: 'low' });
      navigate('/home');
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return { email, password, errorMessage, handleEmailChange, handlePasswordChange, handleSubmit };
};

export default useLogin;
