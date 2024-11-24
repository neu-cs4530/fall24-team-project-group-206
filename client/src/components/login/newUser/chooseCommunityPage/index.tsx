import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useRelevantCommunities from '../../../../hooks/useRelevantCommunities';
import useUserContext from '../../../../hooks/useUserContext';
import useCommunityNames from '../../../../hooks/useCommunityNames';
import { updatedUserInCommunity } from '../../../../services/communityService';
import { Community } from '../../../../types';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { user } = useUserContext();
  const { relevantCommunities, loading, error } = useRelevantCommunities(user.tags);
  const { communityNames, loading: loadingAll, error: errorAll } = useCommunityNames();

  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  // const [updayedCommunity, setUpdatedCommunity] = useState<Community>();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (relevantCommunities.length > 0) {
      setSelectedCommunity(relevantCommunities[0]);
    }
  }, [relevantCommunities]);

  // useEffect(() => {
  //   const handleCommunityUpdate = (updatedCommunity: Community) => {
  //     setUpdatedCommunity(updatedCommunity);
  //   };

  //   socket.on('communityUpdate', handleCommunityUpdate);
  //   console.log('Community updated:', handleCommunityUpdate);

  //   return () => {
  //     socket.off('communityUpdate'); // Clean up the socket event listener
  //   };
  // }, [socket, user.community]);

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const { currentUser } = auth;
      if (currentUser) {
        console.log('Saving community for user:', currentUser.email);
        await updateUserCommunity(currentUser.email!, community); // Call the backend service
        user.community = community;
        await updatedUserInCommunity(currentUser.email!, community);

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

  if (loading || loadingAll) {
    return <p>Loading communities...</p>;
  }

  if (error || errorAll) {
    return <p>Error: {error || errorAll}</p>;
  }

  const allCommunitiesExceptRecommended = communityNames.filter(
    community => !relevantCommunities.includes(community),
  );

  const filteredAllCommunities = allCommunitiesExceptRecommended.filter(community =>
    community.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />

      <div className='recommendation-header'>
        <h2>Recommended Communities:</h2>
      </div>
      {relevantCommunities.length > 0 ? (
        <div className='community-list'>
          {relevantCommunities.map(community => (
            <li
              className={`community-pill ${selectedCommunity === community ? 'selected' : ''}`}
              key={community}
              onClick={() => handleCommunityClick(community)}>
              {community}
            </li>
          ))}
        </div>
      ) : (
        <p>No recommended communities available.</p>
      )}

      <div className='recommendation-header'>
        <h2>All Communities:</h2>
      </div>
      <input
        type='text'
        className='search-bar'
        placeholder='Search all communities...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {filteredAllCommunities.length > 0 ? (
        <div className='community-list'>
          {filteredAllCommunities.map(community => (
            <li
              className={`community-pill ${selectedCommunity === community ? 'selected' : ''}`}
              key={community}
              onClick={() => handleCommunityClick(community)}>
              {community}
            </li>
          ))}
        </div>
      ) : (
        <p>No other communities match your search.</p>
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
