/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
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

  const saveCommunityToUserAccount = async () => {
    if (!user?.username) return;

    try {
      await updateUserCommunity(user.username, userCommunity);
      console.log('Community updated:', userCommunity);
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  return (
    <div className='community-info'>
      <div className='community-main-title'>
        <h2>Community Information</h2>
      </div>
      <p>
        {userCommunity
          ? `You are in the community: ${userCommunity}`
          : 'You are not in any community.'}
      </p>
      <h3>Select a new Community</h3>
      <div>
        {communityNames.map(community => (
          <div
            key={community.name}
            className={`community-pill ${community.name === userCommunity ? 'selected' : ''}`}
            onClick={() => handleCommunitySelect(community.name)}>
            {community.name}
          </div>
        ))}
      </div>
      <button
        className='save-community-button'
        onClick={saveCommunityToUserAccount}
        disabled={!userCommunity}>
        Save Community
      </button>
    </div>
  );
};

export default CommunityInfo;
