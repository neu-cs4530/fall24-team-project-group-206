import React, { useEffect, useState } from 'react';
import './index.css';
import useUserContext from '../../../../hooks/useUserContext';
import { auth } from '../../../../firebaseConfig';

/**
 * AccountInfo component which displays the user's username and password.
 */
const AccountInfo = () => {
  const { user } = useUserContext();
  const [creationTime, setCreationTime] = useState<string | null>(null);

  useEffect(() => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      if (firebaseUser.metadata.creationTime) {
        setCreationTime(new Date(firebaseUser.metadata.creationTime).toLocaleDateString());
      }
    }
  }, []);

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className='account-info'>
      <div className='user-info'>
        <div className='initials-box'>{initials}</div>
        <div className='user-details'>
          <h2>{`${user.first_name} ${user.last_name}`}</h2>
          {creationTime && <p className='creation-date'>Account Created On: {creationTime}</p>}
          <div className='username-row'>
            <h4 className='username'>username:</h4>
            <p className='username-info'>{user.username}</p>
          </div>
          <div className='username-row'>
            <h4 className='username'>status:</h4>
            <p className='username-info'>{user.status}</p>
          </div>
        </div>
      </div>
      <button className='go-back-button'>Go Back</button>
    </div>
  );
};

export default AccountInfo;
