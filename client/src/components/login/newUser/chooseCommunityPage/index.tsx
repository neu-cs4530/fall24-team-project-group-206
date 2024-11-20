/* eslint-disable no-console */
import React, { useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames';

const ChooseCommunityPage = () => {
  const { communityNames } = useCommunityNames();
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('Saving community for user:', user.email);
        
        // Call the backend API to add the user to the selected community
        const response = await fetch(`/community/addUserToCommunity/${community}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user.email }),
        });

        if (!response.ok) {
          throw new Error('Failed to add user to the community');
        }

        console.log('Community updated successfully in the backend');

        // Optionally save the community to the user's profile
        await updateUserCommunity(user.email!, community);
        console.log('Community also saved to user account');
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='recommendation-header'>
        <h2>Recommended Communities:</h2>
      </div>
      <div className='community-list'>
        {communityNames &&
          communityNames.map(community => (
            <li
              className={`community-pill ${selectedCommunity === community.name ? 'selected' : ''}`}
              key={community.name}
              onClick={() => handleCommunityClick(community.name)}>
              {community.name}
            </li>
          ))}
      </div>
      <div className='button-container'>
        <button
          className={`next-button ${!selectedCommunity ? 'disabled' : ''}`}
          disabled={!selectedCommunity}
          onClick={() => {
            console.log('Saving community:', selectedCommunity);
            saveCommunityToUserAccount(selectedCommunity);
          }}>
          <NavLink className='button-text' to='/home'>
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default ChooseCommunityPage;
