/* eslint-disable import/no-extraneous-dependencies */
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '../firebaseConfig';
import useLoginContext from './useLoginContext';
import { getUser } from '../services/userService';

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
      await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUser(email);
      setUser({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        tags: userData.tags,
        community: userData.community,
        status: userData.status,
      });
      if (userData.community) {
        navigate('/communityHome');
      } else {
        navigate('/defaultHome');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      const redirectPath = localStorage.getItem('redirectPath') || '/home';
      localStorage.removeItem('redirectPath');

      // // navigate('/home');
      // navigate(redirectPath); // Redirect to the stored path
      // Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      // Cookies.remove('redirectPath');

      // Store redirect path in cookies
      // const redirectPath = Cookies.get('redirectPath') || '/home';
      // Cookies.remove('redirectPath');

      // Navigate to the saved path
      navigate(redirectPath);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return { email, password, errorMessage, handleEmailChange, handlePasswordChange, handleSubmit };
};

export default useLogin;
