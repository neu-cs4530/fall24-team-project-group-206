// /* eslint-disable no-console */
// import React, { useState } from 'react';
// import './index.css';
// import { NavLink } from 'react-router-dom';
// import { auth } from '../../../../firebaseConfig';
// import { updateUserCommunity } from '../../../../services/userService';
// import logo from '../../../../logo.svg';
// import useCommunityNames from '../../../../hooks/useCommunityNames';

// /**
//  * Depicts communities that the user can choose from.
//  */
// const ChooseCommunityPage = () => {
//   const { communityNames } = useCommunityNames();
//   const [selectedCommunity, setSelectedCommunity] = useState<string>('');

//   const handleCommunityClick = (communityName: string) => {
//     setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
//   };

//   const saveCommunityToUserAccount = async (community: string) => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         console.log('Saving community for user:', user.email);
//         await updateUserCommunity(user.email!, community); // Call the backend service
//         console.log('Community updated successfully');
//       } else {
//         console.error('No user is logged in.');
//       }
//     } catch (error) {
//       console.error('Error saving community:', error);
//     }
//   };

//   return (
//     <div className='community-container'>
//       <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
//       <div className='recommendation-header'>
//         <h2>Recommended Communities:</h2>
//       </div>
//       <div className='community-list'>
//         {communityNames &&
//           communityNames.map(community => (
//             <li
//               className={`community-pill ${selectedCommunity === community.name ? 'selected' : ''}`}
//               key={community.name}
//               onClick={() => handleCommunityClick(community.name)}>
//               {community.name}
//             </li>
//           ))}
//       </div>
//       <div className='button-container'>
//         <button
//           className='next-button'
//           onClick={() => {
//             console.log('Saving community:', selectedCommunity);
//             saveCommunityToUserAccount(selectedCommunity);
//           }}>
//           <NavLink className='button-text' to='/home'>
//             Next
//           </NavLink>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChooseCommunityPage;

/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { getUser, updateUserCommunity } from '../../../../services/userService';
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [userTags, setUserTags] = useState<string[]>([]);
  // Fetch user tags to filter communities
  useEffect(() => {
    const fetchUserTags = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userData = await getUser(user.email!);
          console.log('User info:', userData);
          console.log('User info:', userData.tags);
          setUserTags(userData.tags || []); // Set tags from user profile
          console.log('Fetched user tags:', userData.tags);
        }
      } catch (error) {
        console.error('Error fetching user tags:', error);
      }
    };

    fetchUserTags();
  }, []);

  // Fetch communities based on user-selected tags
  const { communityNames } = useCommunityNames(userTags);

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('Saving community for user:', user.email);
        await updateUserCommunity(user.email!, community); // Save selected community to user profile
        console.log('Community updated successfully');
        const userData = await getUser(user.email!); // Fetch updated user data
        setUserTags(userData.tags || []);
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  // Separate the top recommendation from additional ones
  const topRecommendation = communityNames?.[0];
  const additionalRecommendations = communityNames?.slice(1);
  console.log('Top recommendation:', topRecommendation);
  console.log('Additional recommendations:', additionalRecommendations);

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='recommendation-header'>
        <h2>Recommended Community:</h2>
        {topRecommendation && (
          <li
            className={`community-pill ${selectedCommunity === topRecommendation.name ? 'selected' : ''}`}
            onClick={() => handleCommunityClick(topRecommendation.name)}>
            {topRecommendation.name}
          </li>
        )}
      </div>
      {additionalRecommendations && additionalRecommendations.length > 0 && (
        <div className='recommendation-header'>
          <h3>Other Communities You May Like:</h3>
        </div>
      )}
      <div className='community-list'>
        {additionalRecommendations &&
          additionalRecommendations.map(community => (
            <li
              className={`community-pill ${selectedCommunity === community.name ? 'selected' : ''}`}
              key={community.name}
              onClick={() => handleCommunityClick(community.name)}>
              {community.name}
            </li>
          ))}
      </div>
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
