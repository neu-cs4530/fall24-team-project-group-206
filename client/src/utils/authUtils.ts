/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';

/**
 * This function checks if the user is logged in by checking cookies or localStorage.
 *
 * @returns {boolean} - Returns true if the user is logged in (cookies contain user data), false otherwise.
 */
export const checkLoginStatus = (): boolean => {
  const user = Cookies.get('user'); // Check if user data exists in cookies
  return !!user; // If user exists, return true; otherwise, false
};
