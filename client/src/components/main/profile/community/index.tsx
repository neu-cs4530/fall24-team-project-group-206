/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './index.css';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { getUser, updateUserCommunity } from '../../../../services/userService';

/**
 * CommunityInfo component which displays the community (if applicable) that they are in.
 */
const CommunityInfo = () => {
  const { user } = useUserContext();
  const { communityNames } = useCommunityNames();
  const [userCommunity, setUserCommunity] = useState<string>('');

  const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:8000');

  useEffect(() => {
    const fetchUserCommunity = async () => {
      if (!user?.username) return;

      try {
        const data = await getUser(user.username); // Fetch user data from MongoDB
        setUserCommunity(data.community || '');
      } catch (error) {
        console.error('Error fetching community:', error);
      }
    };

    fetchUserCommunity();
  }, [user]);

  const handleCommunitySelect = (communityName: string) => {
    setUserCommunity(communityName);
  };

  const handleCommunityRemove = () => {
    setUserCommunity('');
  };

  const saveCommunityToUserAccount = async (community: string) => {
    if (!user?.username) return;

    try {
      const updatedUser = await updateUserCommunity(user.username, community); // Save community
      setUserCommunity(updatedUser.community);
      socket.emit('communityUpdate', { communityName: community, user: user.username }); // Notify via socket
      console.log('Community updated successfully:', updatedUser.community);
    } catch (err) {
      console.error('Failed to update user community:', err);
    }
  };

  useEffect(() => {
    socket.on('communityUpdate', updatedCommunity => {
      if (updatedCommunity.users.includes(user.username)) {
        setUserCommunity(updatedCommunity.name); // Sync UI with updated community
      }
    });
    return () => {
      socket.off('communityUpdate'); // Clean up on component unmount
    };
  }, [socket, user.username]);

  const filteredCommunities = communityNames.filter(community => community.name !== userCommunity);

  return (
    <div className='community-info'>
      <div className='community-main-title'>
        <h2>Your Community</h2>
      </div>

      <div className='selected-community'>
        {userCommunity ? (
          <div className='community-pill selected' onClick={handleCommunityRemove}>
            {userCommunity}
          </div>
        ) : (
          <p>No community selected.</p>
        )}
      </div>

      <div className='title-two'>
        <h3>Select a new Community</h3>
      </div>
      <div className='community-pills-container'>
        {filteredCommunities.map(community => (
          <div
            key={community.name}
            className='community-pill'
            onClick={() => handleCommunitySelect(community.name)}>
            {community.name}
          </div>
        ))}
      </div>

      <button
        className='save-community-button'
        onClick={() => saveCommunityToUserAccount(userCommunity)}>
        Save Community
      </button>
    </div>
  );
};

export default CommunityInfo;
