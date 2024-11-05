import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

/**
 * Initial page that leads users to a sign in page if they're already a user or a create account if
 * they aren't.
 */
const UserSelection = () => {
  const navigate = useNavigate();

  const handleNewUserClick = () => {};

  const handleExistingUserClick = () => {
    navigate('/existing');
  };

  return (
    <div className='container'>
      <div>
        <h2>Welcome to FakeStackOverflow!</h2>
      </div>
      <div className='button-group'>
        <button type='button' className='user-button' onClick={handleNewUserClick}>
          New User
        </button>
        <button type='button' className='user-button' onClick={handleExistingUserClick}>
          Existing User
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
