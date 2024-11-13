/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './index.css';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarHome from './sideBarHome';

/**
 * Profile Page contains the user's profile information including account info, tags, community,
 * and status
 */
const ProfilePage = () => {
  const location = useLocation();
  let titleText = '';
  switch (location.pathname) {
    case '/profile/account':
      titleText = 'Account Information';
      break;
    case '/profile/tags':
      titleText = 'Your Tags';
      break;
    case '/profile/community':
      titleText = 'Community';
      break;
      break;
    default:
      break;
  }

  return (
    <div>
      <h1 className='profile-title'>PROFILE</h1>
      <div className='home-container'>
        <SideBarHome />
        <div className='profile-content'>
          {/* <ProfileHeader className='title-text' titleText={titleText} /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
