import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './index.css';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';
import { updateUserCommunity } from '../../../../services/userService';

// Initialize the socket connection globally
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:8000');

const CommunityInfo = () => {
  const { user, setUser } = useUserContext(); // Access user context
  const { communityNames } = useCommunityNames(); // Fetch list of communities
  const [userCommunity, setUserCommunity] = useState<string>(''); // Track selected community
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Load the user's current community on component mount
  useEffect(() => {
    if (user?.community) {
      setUserCommunity(user.community); // Set initial community
    }
  }, [user]);

  // Handle selecting a new community
  const handleCommunitySelect = (communityName: string) => {
    setUserCommunity(communityName);
    setError(null); // Clear errors
  };

  // Handle removing the current community
  const handleCommunityRemove = () => {
    setUserCommunity('');
    setError(null); // Clear errors
  };

  // Save the selected community to the user's account
  const saveCommunityToUserAccount = async (community: string) => {
    if (!community) {
      setError('Please select a community before saving.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const updatedUser = await updateUserCommunity(user.username, community); // Save community
      setUser(prevUser => ({
        ...prevUser,
        community: updatedUser.community,
      })); // Update context
      setUserCommunity(updatedUser.community); // Update local state
      setError(null); // Clear errors
      socket.emit('communityUpdate', { communityName: community, user: user.username }); // Notify via socket
      console.log('Community updated successfully:', updatedUser.community);
    } catch (err) {
      console.error('Failed to update user community:', err);
      setError('Failed to update community. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Listen for socket updates
  useEffect(() => {
    socket.on('communityUpdate', updatedCommunity => {
      if (updatedCommunity.users.includes(user.username)) {
        setUserCommunity(updatedCommunity.name); // Sync UI with updated community
      }
    });

    return () => {
      socket.off('communityUpdate'); // Clean up on component unmount
    };
  }, [user.username]);

  // Filter out the user's current community from the list
  const filteredCommunities = communityNames.filter(community => community.name !== userCommunity);

  return (
    <div className='community-info'>
      <div className='community-main-title'>
        <h2>Your Community</h2>
      </div>

      <div className='selected-community'>
        {userCommunity ? (
          <div
            className='community-pill selected'
            onClick={handleCommunityRemove}
            title='Click to remove your current community'>
            {userCommunity}
          </div>
        ) : (
          <p>No community selected.</p>
        )}
      </div>

      <div className='title-two'>
        <h3>Select a New Community</h3>
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

      {error && <p className='error-message'>{error}</p>}

      <button
        className='save-community-button'
        onClick={() => saveCommunityToUserAccount(userCommunity)}
        disabled={loading || !userCommunity} // Disable if no community is selected or loading
      >
        {loading ? 'Saving...' : 'Save Community'}
      </button>
    </div>
  );
};

export default CommunityInfo;
