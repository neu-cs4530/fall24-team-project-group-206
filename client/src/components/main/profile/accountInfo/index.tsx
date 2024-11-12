import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

/**
 * AccountInfo component which displays the user's username and password.
 */
const AccountInfo = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      <div className='account-info'>
        <h2>Username:</h2>
        <p>[placeholder username]</p>
      </div>
      <button className='back-button' onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AccountInfo;
