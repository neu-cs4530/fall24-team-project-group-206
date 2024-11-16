/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { getUser } from '../../../../services/userService';

/**
 * AccountInfo component which displays the user's username and status.
 */
const AccountInfo = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    status: '',
  });
  const [creationTime, setCreationTime] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.email) {
        try {
          const data = await getUser(firebaseUser.email);
          setUserData({
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
            status: data.status,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();

    // Get account creation time from firebase metadata
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.metadata.creationTime) {
      setCreationTime(new Date(firebaseUser.metadata.creationTime).toLocaleDateString());
    }
  }, []);

  const initials =
    `${userData.first_name?.[0] ?? ''}${userData.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className='account-info'>
      <div className='user-info'>
        <div className='initials-box'>{initials}</div>
        <div className='user-details'>
          <h2>{`${userData.first_name} ${userData.last_name}`}</h2>
          {creationTime && <p className='creation-date'>Account Created On: {creationTime}</p>}
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
        <NavLink to='/' className='go-back-button'>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default AccountInfo;
