import { useEffect, useState } from 'react';
import { getCommunityNames } from '../services/communityService';
import { Community } from '../types';

/**
 * Custom hook to handle fetching community details by community name.
 *
 * @param t - The tag object to fetch data for
 *
 * @returns community - The current community details.
 * @returns setCommunity - Setter to manually update the community state if needed.
 */
const useCommunityNames = () => {
  const [communityNames, setCommunityNames] = useState<Community[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCommunityNames();
        if (Array.isArray(res)) {
          setCommunityNames(res);
        } else {
          setCommunityNames([]);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    fetchData();
  });

  return {
    communityNames,
  };
};

export default useCommunityNames;
