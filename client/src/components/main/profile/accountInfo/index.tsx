/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { doc, getDoc } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';
import { auth, db } from '../../../../firebaseConfig';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * AccountInfo component which displays the user's username and password.
 */
const AccountInfo = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    status: '',
  });
  const [creationTime, setCreationTime] = useState<string | null>(null);
  const { user } = useUserContext();
  useEffect(() => {
    const fetchUserData = async () => {
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.email) {
        try {
          const userRef = doc(db, 'users', firebaseUser.email);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              username: data.username || firebaseUser.email,
              status: user.status || 'low',
            });
          } else {
            console.log('No such user!');
          }
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
