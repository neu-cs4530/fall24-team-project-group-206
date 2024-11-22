/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { updatedUserCommunity } from '../../../../services/communityService';
import { Community, CommunityData } from '../../../../types';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { socket } = useUserContext();
  const { communityNames } = useCommunityNames();
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [communityUsers, setCommunityUsers] = useState<Community>();

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('Saving community for user:', user.email);
        await updateUserCommunity(user.email!, community); // Call the backend service
        // await updatedUserCommunity(user.email!, community);
        console.log('Community updated successfully');
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  useEffect(() => {
    const handleCommunityUpdate = async (communityData: CommunityData) => {
      setCommunityUsers(communityData);
      console.log('Community data:', communityData);
    };
    socket.on('communityUpdate', handleCommunityUpdate);

    return () => {
      socket.off('communityUpdate', handleCommunityUpdate);
    };
  }, [socket]);

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
          className='next-button'
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
