/* eslint-disable no-console */
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { signInWithEmailAndPassword } from 'firebase/auth';
import useLoginContext from './useLoginContext';
import { auth } from '../firebaseConfig';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      console.log(auth);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser({ username: user.email ?? '' });
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return { email, password, handleEmailChange, handlePasswordChange, handleSubmit };
};

export default useLogin;
