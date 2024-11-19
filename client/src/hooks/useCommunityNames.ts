/* eslint-disable no-console */
// import { useEffect, useState } from 'react';
// import { getCommunityNames } from '../services/communityService';
// import { Community } from '../types';

// /**
//  * Custom hook to handle fetching community details by community name.
//  *
//  * @param t - The tag object to fetch data for
//  *
//  * @returns community - The current community details.
//  * @returns setCommunity - Setter to manually update the community state if needed.
//  */
// const useCommunityNames = () => {
//   const [communityNames, setCommunityNames] = useState<Community[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await getCommunityNames();
//         if (Array.isArray(res)) {
//           setCommunityNames(res);
//         } else {
//           setCommunityNames([]);
//         }
//       } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log(e);
//       }
//     };
//     fetchData();
//   });

//   return {
//     communityNames,
//   };
// };

// export default useCommunityNames;

import { useEffect, useState } from 'react';
import { getCommunityNames } from '../services/communityService';
import { Community } from '../types';

/**
 * Custom hook to fetch and filter community names based on user-selected tags.
 *
 * @param userTags - Array of tags selected by the user.
 * @returns communityNames - Filtered list of communities.
 */
const useCommunityNames = (userTags: string[]) => {
  const [communityNames, setCommunityNames] = useState<Community[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCommunities = await getCommunityNames();

        if (Array.isArray(allCommunities)) {
          // Filter communities to include only those matching user-selected tags
          const filteredCommunities = allCommunities.filter(community =>
            community.tags.some(tag => userTags.includes(tag)),
          );
          setCommunityNames(filteredCommunities);
        } else {
          setCommunityNames([]);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setCommunityNames([]);
      }
    };

    fetchData();
  }, [userTags]);

  return { communityNames };
};

export default useCommunityNames;
