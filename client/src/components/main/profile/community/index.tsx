/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { getUser, updateUserCommunity } from '../../../../services/userService';
import { updatedUserCommunity } from '../../../../services/communityService';

/**
 * CommunityInfo component which displays the community (if applicable) that they are in.
 */
const CommunityInfo = () => {
  const { user, socket } = useUserContext();
  const { communityNames } = useCommunityNames();
  const [userCommunity, setUserCommunity] = useState<string>('');

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

    // const handleCommunityUpdate = () => {
    //   console.log('Community updated:');
    //   updatedUserCommunity(user?.username, userCommunity);
    // };

    // // if (socket) {
    // //   socket.on('communityUpdate', handleCommunityUpdate);
    // // }

    // // return () => {
    // //   if (socket) {
    // //     socket.off('communityUpdate', handleCommunityUpdate);
    // //   }
    // // };
  }, [user?.username, socket, userCommunity]);

  const handleCommunitySelect = (communityName: string) => {
    setUserCommunity(communityName);
  };

  const handleCommunityRemove = () => {
    setUserCommunity('');
  };

  const saveCommunityToUserAccount = async () => {
    if (!user?.username) return;

    try {
      await updateUserCommunity(user.username, userCommunity);
      await updatedUserCommunity(user.username, userCommunity);
      console.log('Community updated:', userCommunity);
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

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

      <button className='save-community-button' onClick={saveCommunityToUserAccount}>
        Save Community
      </button>
    </div>
  );
};

export default CommunityInfo;
