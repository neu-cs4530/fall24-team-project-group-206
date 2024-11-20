/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useRelevantCommunities from '../../../../hooks/useCommunityNames';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { user } = useUserContext();
  const userTags = user?.tags || []; // Assuming tags are available in user context
  const { relevantCommunities, loading, error } = useRelevantCommunities(userTags);
  console.log('relevantCommunities:', relevantCommunities);
  console.log('loading:', loading);
  console.log('error:', error);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  useEffect(() => {
    if (user) {
      console.log('User info:', user);
    }
  }, [user]);

  useEffect(() => {
    if (relevantCommunities.length > 0) {
      setSelectedCommunity(relevantCommunities[0]); // Automatically select the top recommended community
    }
  }, [relevantCommunities]);

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const { currentUser } = auth;
      if (currentUser) {
        console.log('Saving community for user:', currentUser.email);
        await updateUserCommunity(currentUser.email!, community);
        console.log('Community updated successfully');
      } else {
        console.error('No user is logged in.');
      }
    } catch (saveError) {
      console.error('Error saving community:', saveError);
    }
  };

  if (loading) {
    return <p>Loading communities...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='recommendation-header'>
        <h2>Recommended Communities:</h2>
      </div>
      {relevantCommunities.length > 0 ? (
        <>
          <div className='top-recommendation'>
            <h3>Top Recommended Community:</h3>
            <li
              className={`community-pill ${selectedCommunity === relevantCommunities[0] ? 'selected' : ''}`}
              onClick={() => handleCommunityClick(relevantCommunities[0])}>
              {relevantCommunities[0]}
            </li>
          </div>
          <div className='other-recommendations'>
            <h3>Other Recommendations:</h3>
            <ul className='community-list'>
              {relevantCommunities.slice(1).map(community => (
                <li
                  className={`community-pill ${selectedCommunity === community ? 'selected' : ''}`}
                  key={community}
                  onClick={() => handleCommunityClick(community)}>
                  {community}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>No communities available to recommend.</p>
      )}
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
