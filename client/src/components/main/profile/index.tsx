import React from 'react';
import './index.css';
import SideBarHome from './sideBarHome';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const ProfilePage = () => (
  <div className='home-container'>
    <SideBarHome />
    <h2>Welcome to FakeStackOverflow!</h2>
  </div>
);

export default ProfilePage;
