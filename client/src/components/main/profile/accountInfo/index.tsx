/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';
import { auth } from '../../../../firebaseConfig';
import { getUser } from '../../../../services/userService';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * AccountInfo component which displays the user's username and status.
 */
const AccountInfo = () => {
  const { user } = useUserContext();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    status: '',
    creationTime: '',
  });
  // const [creationTime, setCreationTime] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccountInfo = Cookies.get('accountInfo');
    if (storedAccountInfo) {
      const parsedAccountInfo = JSON.parse(storedAccountInfo);
      console.log('Retrieved from cookies:', parsedAccountInfo);
      setUserData({
        first_name: parsedAccountInfo.firstName,
        last_name: parsedAccountInfo.lastName,
        username: parsedAccountInfo.username,
        status: parsedAccountInfo.status,
        creationTime: parsedAccountInfo.creationTime,
      });
    } else {
      const fetchUserData = async () => {
        const firebaseUser = auth.currentUser;
        if (firebaseUser && firebaseUser.email) {
          try {
            const data = await getUser(firebaseUser.email);
            const creationTime = firebaseUser.metadata.creationTime
              ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString()
              : '';
            console.log('Fetched from Firebase:', { ...data, creationTime });
            setUserData({
              first_name: data.firstName,
              last_name: data.lastName,
              username: data.username,
              status: data.status,
              creationTime,
            });
            Cookies.set('accountInfo', JSON.stringify({ ...data, creationTime }));
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };

      fetchUserData();
    }

    // // Get account creation time from firebase metadata
    // const firebaseUser = auth.currentUser;
    // if (firebaseUser && firebaseUser.metadata.creationTime) {
    //   setCreationTime(new Date(firebaseUser.metadata.creationTime).toLocaleDateString());
    // }
  }, [user]);

  const initials =
    `${userData.first_name?.[0] ?? ''}${userData.last_name?.[0] ?? ''}`.toUpperCase();

  const handleLogout = () => {
    // Remove user data from state and cookies
    Cookies.remove('user'); // Clear the user cookie
    Cookies.remove('accountInfo');
    // Reset any other session-related state if necessary
    // Navigate to the login page
    navigate('/');
  };

  if (!userData.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className='account-info'>
      <div className='user-info'>
        <div className='initials-box'>{initials}</div>
        <div className='user-details'>
          <h2>{`${userData.first_name} ${userData.last_name}`}</h2>
          {userData.creationTime && (
            <p className='creation-date'>Account Created On: {userData.creationTime}</p>
          )}
          <div className='username-row'>
            <h4 className='username'>username:</h4>
            <p className='username-info'>{userData.username}</p>
          </div>
          <div className='username-row'>
            <h4 className='username'>status:</h4>
            <p className='username-info'>{userData.status}</p>
          </div>
        </div>
      </div>
      <div className='button-container'>
        <NavLink to='/' className='go-back-button' onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default AccountInfo;
