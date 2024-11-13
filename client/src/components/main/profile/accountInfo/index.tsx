import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * AccountInfo component which displays the user's username and password.
 */
const AccountInfo = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      <div className='account-info'>
        <h2>First Name:</h2>
        <p>{user.first_name}</p>
        <h2>Last Name:</h2>
        <p>{user.last_name}</p>
        <h2>Username:</h2>
        <p>{user.username}</p>
      </div>
      <button className='go-back-button' onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AccountInfo;
