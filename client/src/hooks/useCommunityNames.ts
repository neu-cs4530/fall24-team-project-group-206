import { useEffect, useState } from 'react';
import { getCommunityNames } from '../services/communityService';

/**
 * Custom hook to handle fetching community names.
 *
 * @returns communityNames - The list of community names.
 * @returns loading - A state indicating if the communities are still loading.
 * @returns error - A state indicating if there was an error during fetching.
 */
const useCommunityNames = () => {
  const [communityNames, setCommunityNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCommunityNames = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getCommunityNames();
        if (Array.isArray(res)) {
          setCommunityNames(res.map(community => community.name)); // Assuming `name` is a property of the community object.
        } else {
          setCommunityNames([]);
        }
      } catch (e) {
        setError('Failed to fetch community names.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityNames();
  }, []); // Run the fetch only once on mount

  return { communityNames, loading, error };
};

export default useCommunityNames;
