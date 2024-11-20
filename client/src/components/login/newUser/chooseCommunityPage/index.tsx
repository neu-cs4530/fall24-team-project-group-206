/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useRelevantCommunities from '../../../../hooks/useRelevantCommunities';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { user } = useUserContext();
  const userTags = user?.tags || [];
  const { relevantCommunities, loading, error } = useRelevantCommunities(userTags);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (relevantCommunities.length > 0) {
      setSelectedCommunity(relevantCommunities[0]);
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

  const handleNextButtonClick = async () => {
    if (selectedCommunity) {
      await saveCommunityToUserAccount(selectedCommunity);
      navigate(`/communityHome`);
    } else {
      navigate('/defaultHome');
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
        <button className='next-button' onClick={handleNextButtonClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseCommunityPage;
