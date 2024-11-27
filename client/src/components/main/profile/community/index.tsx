/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { getUser, updateUserCommunity } from '../../../../services/userService';
import { updatedUserInCommunity } from '../../../../services/communityService';

/**
 * CommunityInfo component which displays the community (if applicable) that they are in.
 * The user can select a new community from the list of available communities.
 */
const CommunityInfo = () => {
  const { user, setUser } = useUserContext();
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

  /**
   * Allows the user to select a new community.
   * @param communityName - The name of the community to be selected.
   */
  const handleCommunitySelect = (communityName: string) => {
    setUserCommunity(communityName);
  };

  /**
   * Removes the community from the user's account.
   */
  const handleCommunityRemove = () => {
    setUserCommunity('');
  };

  /**
   * Saves the chosen community to the user's account.
   */
  const saveCommunityToUserAccount = async () => {
    if (!user?.username) return;

    try {
      await updateUserCommunity(user.username, userCommunity);
      console.log('successful 1');
      setUser({
        ...user,
        community: userCommunity,
      });
      console.log('Community updated:', userCommunity);
      await updatedUserInCommunity(user.username, userCommunity);
      console.log('successful 2');
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  /**
   * Filters out the user's current community from the list of available communities.
   */
  const filteredCommunities = communityNames.filter(community => community !== userCommunity);

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
            key={community}
            className='community-pill'
            onClick={() => handleCommunitySelect(community)}>
            {community}
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
