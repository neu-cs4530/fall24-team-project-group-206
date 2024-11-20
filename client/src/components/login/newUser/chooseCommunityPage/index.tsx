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

// /* eslint-disable no-console */
// import React, { useEffect, useState } from 'react';
// import './index.css';
// import { NavLink } from 'react-router-dom';
// import { getUser, updateUserCommunity } from '../../../../services/userService';
// import logo from '../../../../logo.svg';
// import useCommunityNames from '../../../../hooks/useCommunityNames';
// import useUserContext from '../../../../hooks/useUserContext';
// import { getRelevantCommunities } from '../../../../services/communityService';

// /**
//  * Depicts communities that the user can choose from.
//  */
// const ChooseCommunityPage = () => {
//   // const { user } = useUserContext();
//   const [selectedCommunity, setSelectedCommunity] = useState<string>('');
//   const [userTags, setUserTags] = useState<string[]>([]);
//   // Fetch user tags to filter communities
//   // useEffect(() => {
//   //   const fetchUserTags = async () => {
//   //     try {
//   //       const user = auth.currentUser;
//   //       if (user) {
//   //         const userData = await getUser(user.email!);
//   //         console.log('User info:', userData);
//   //         console.log('User info:', userData.tags);
//   //         setUserTags(userData.tags || []); // Set tags from user profile
//   //         console.log('Fetched user tags:', userData.tags);
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching user tags:', error);
//   //     }
//   //   };

//   //   fetchUserTags();
//   // }, []);
//   // useEffect(() => {
//   //   if (!user?.username) return;

//   //   const fetchTags = async () => {
//   //     try {
//   //       const data = await getUser(user.username); // Fetch user data from MongoDB
//   //       setUserTags(data.tags || []);
//   //     } catch (error) {
//   //       console.error('Error fetching tags:', error);
//   //     }
//   //   };

//   //   fetchTags();
//   // }, [user]);

//   // Fetch communities based on user-selected tags
//   const [communityNames, setCommunityNames] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         const communities = await getRelevantCommunities(userTags);
//         setCommunityNames(communities);
//       } catch (error) {
//         console.error('Error fetching communities:', error);
//       }
//     };

//     fetchCommunities();
//   }, [userTags]);

//   const handleCommunityClick = (communityName: string) => {
//     setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
//   };

//   // const saveCommunityToUserAccount = async (community: string) => {
//   //   if (!user?.username) return;
//   //   try {
//   //     console.log('Saving community for user:', user.username);
//   //     await updateUserCommunity(user.username!, community); // Save selected community to user profile
//   //     console.log('Community updated successfully');
//   //     const userData = await getUser(user.username!); // Fetch updated user data
//   //     setUserTags(userData.tags || []);
//   //   } catch (error) {
//   //     console.error('Error saving community:', error);
//   //   }
//   // };

//   // Separate the top recommendation from additional ones
//   const topRecommendation = communityNames?.[0];
//   const additionalRecommendations = communityNames?.slice(1);
//   console.log('Top recommendation:', topRecommendation);
//   console.log('Additional recommendations:', additionalRecommendations);

//   return (
//     <div className='community-container'>
//       <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
//       <div className='recommendation-header'>
//         <h2>Recommended Community:</h2>
//         {topRecommendation && (
//           <li
//             className={`community-pill ${selectedCommunity === topRecommendation ? 'selected' : ''}`}
//             onClick={() => handleCommunityClick(topRecommendation)}>
//             {topRecommendation}
//           </li>
//         )}
//       </div>
//       {additionalRecommendations && additionalRecommendations.length > 0 && (
//         <div className='recommendation-header'>
//           <h3>Other Communities You May Like:</h3>
//         </div>
//       )}
//       <div className='community-list'>
//         {additionalRecommendations &&
//           additionalRecommendations.map(community => (
//             <li
//               className={`community-pill ${selectedCommunity === community ? 'selected' : ''}`}
//               key={community}
//               onClick={() => handleCommunityClick(community)}>
//               {community}
//             </li>
//           ))}
//       </div>
//       <div className='button-container'>
//         <button
//           className='next-button'
//           onClick={() => {
//             console.log('Saving community:', selectedCommunity);
//             // saveCommunityToUserAccount(selectedCommunity);
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
import logo from '../../../../logo.svg';
import useUserContext from '../../../../hooks/useUserContext';
import { getRelevantCommunities } from '../../../../services/communityService';
import { Community } from '../../../../types';
import { updateUserCommunity } from '../../../../services/userService';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { user } = useUserContext(); // Fetch the logged-in user context
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [communityNames, setCommunityNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch communities based on user's tags
  useEffect(() => {
    const fetchCommunities = async () => {
      if (!user?.tags || user.tags.length === 0) {
        setError('No tags available to fetch communities.');
        return;
      }

      try {
        const communities = await getRelevantCommunities(user.tags);
        setCommunityNames(communities.map((community: string) => community));
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        console.error('Error fetching communities:', error);
        setError('Failed to fetch communities. Please try again.');
      }
    };

    fetchCommunities();
  }, [user?.tags]);

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async () => {
    if (!selectedCommunity) {
      setError('Please select a community to continue.');
      return;
    }

    try {
      console.log(`Saving community for user: ${user?.username}`);
      await updateUserCommunity(user?.username, selectedCommunity);
      console.log('Community updated successfully');
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      console.error('Error saving community:', error);
      setError('Failed to save community. Please try again.');
    }
  };

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='recommendation-header'>
        <h2>Recommended Communities</h2>
      </div>
      {error && <p className='error-message'>{error}</p>}
      <div className='community-list'>
        {communityNames.map(community => (
          <li
            className={`community-pill ${selectedCommunity === community ? 'selected' : ''}`}
            key={community}
            onClick={() => handleCommunityClick(community)}>
            {community}
          </li>
        ))}
      </div>
      <div className='button-container'>
        <button className='next-button' onClick={saveCommunityToUserAccount}>
          <NavLink className='button-text' to='/home'>
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default ChooseCommunityPage;
