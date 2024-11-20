/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { getRelevantCommunities } from '../services/communityService';

/**
 * Custom hook to handle fetching relevant community details based on provided tags.
 *
 * @param tags - The list of tags to fetch relevant communities for.
 *
 * @returns relevantCommunities - The current list of relevant communities.
 * @returns setRelevantCommunities - Setter to manually update the relevant communities state if needed.
 */
const useCommunityNames = (tags: string[]) => {
  const [relevantCommunities, setRelevantCommunities] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRelevantCommunities = async () => {
      setLoading(true);
      setError('');
      console.log('Fetching communities for tags:', tags);
      try {
        const res = await getRelevantCommunities(tags);
        console.log('Response received:', res);
        if (Array.isArray(res)) {
          setRelevantCommunities(res);
        } else {
          setRelevantCommunities([]);
        }
      } catch (e) {
        // Handle errors gracefully
        setError('Failed to fetch relevant communities.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (tags.length > 0) {
      fetchRelevantCommunities();
    }
  }, [tags]); // Re-fetch communities when the tags change

  return {
    relevantCommunities,
    setRelevantCommunities,
    loading,
    error,
  };
};

export default useCommunityNames;
