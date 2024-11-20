/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { updateUserCommunity } from '../../../../services/userService';
import { addUserToCommunity } from '../../../../services/communityService';

/**
 * CommunityInfo component which displays the community (if applicable) that the user is in.
 */
const CommunityInfo = () => {
  const { user } = useUserContext(); // Get user context
  const { communityNames } = useCommunityNames(); // Get community names
  const [userCommunity, setUserCommunity] = useState<string>(''); // Store the user's selected community

  // Fetch user's current community from the context
  useEffect(() => {
    if (user?.community) {
      setUserCommunity(user.community);
    }
  }, [user]);

  // Handle selecting a new community
  const handleCommunitySelect = async (communityName: string) => {
    try {
      const username = 'exampleUser'; // Replace with actual username logic
      const updatedCommunity = await addUserToCommunity(communityName, username);
      console.log('Updated Community:', updatedCommunity);
    } catch (error) {
      console.error('Failed to add user to community:', error);
    }
  };
  

  // Handle removing the current community
  const handleCommunityRemove = () => {
    setUserCommunity('');
  };

  // Save the selected community to the backend
  const saveCommunityToUserAccount = async () => {
    if (!user?.username || !userCommunity) {
      console.error('Cannot save: No user or no community selected.');
      return;
    }

    try {
      console.log(`Saving community "${userCommunity}" for user: ${user.username}`);
      await updateUserCommunity(user.username, userCommunity); // Update backend
      console.log('Community updated successfully!');
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  // Filter out the current community from the list of available communities
  const filteredCommunities = communityNames.filter(
    community => community.name !== userCommunity
  );

  return (
    <div className="community-info">
      <div className="community-main-title">
        <h2>Your Community</h2>
      </div>

      <div className="selected-community">
        {userCommunity ? (
          <div
            className="community-pill selected"
            onClick={handleCommunityRemove}
            title="Click to remove your current community"
          >
            {userCommunity}
          </div>
        ) : (
          <p>No community selected.</p>
        )}
      </div>

      <div className="title-two">
        <h3>Select a New Community</h3>
      </div>
      <div className="community-pills-container">
        {filteredCommunities.map(community => (
          <div
            key={community.name}
            className="community-pill"
            onClick={() => handleCommunitySelect(community.name)}
          >
            {community.name}
          </div>
        ))}
      </div>

      <button
        className="save-community-button"
        onClick={saveCommunityToUserAccount}
        disabled={!userCommunity} // Disable button if no community is selected
      >
        Save Community
      </button>
    </div>
  );
};

export default CommunityInfo;
