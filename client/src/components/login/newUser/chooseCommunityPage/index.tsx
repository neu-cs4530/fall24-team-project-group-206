/* eslint-disable no-console */
import React, { useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { addUserToCommunity } from '../../../../services/communityService'; // Use the service directly
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext'; // Assume you're using a context for the current user

const ChooseCommunityPage = () => {
  const { communityNames } = useCommunityNames(); // Fetch available communities
  const { user } = useUserContext(); // Get the logged-in user's details
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity =>
      prevCommunity === communityName ? '' : communityName
    );
    setError(null); // Clear any previous errors
  };

  const saveCommunityToUserAccount = async (community: string) => {
    if (!user?.username) {
      setError('User is not logged in!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Adding user "${user.username}" to community "${community}"`);

      // Call the backend to add the user to the community
      await addUserToCommunity(community, user.username);

      console.log('Community updated successfully in the backend');
    } catch (error) {
      console.error('Error adding user to community:', error);
      setError('Failed to update community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community-container">
      <img src={logo} alt="Fake Stack Overflow Logo" className="logo-login" />
      <div className="recommendation-header">
        <h2>Recommended Communities:</h2>
      </div>
      <div className="community-list">
        {communityNames.map(community => (
          <li
            key={community.name}
            className={`community-pill ${
              selectedCommunity === community.name ? 'selected' : ''
            }`}
            onClick={() => handleCommunityClick(community.name)}
          >
            {community.name}
          </li>
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
        <button
          className={`next-button ${!selectedCommunity || loading ? 'disabled' : ''}`}
          disabled={!selectedCommunity || loading}
          onClick={() => saveCommunityToUserAccount(selectedCommunity)}
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
        <NavLink className="button-text" to="/home">
          Continue
        </NavLink>
      </div>
    </div>
  );
};

export default ChooseCommunityPage;
