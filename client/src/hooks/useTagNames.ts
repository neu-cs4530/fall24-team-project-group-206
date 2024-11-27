import { useEffect, useState } from 'react';
import { getTagNames } from '../services/tagService';
import { Tag } from '../types';

/**
 * Custom hook to handle fetching tag details by tag name.
 *
 * @param t - The tag object to fetch data for
 *
 * @returns tagnames - The current list of tag names.
 */
const useTagNames = () => {
  const [tagNames, setTagNames] = useState<Tag[]>([]);

  useEffect(() => {
    /**
     * Function to fetch tag names from the server and update the tag list.
     */
    const fetchData = async () => {
      try {
        const res = await getTagNames();
        if (Array.isArray(res)) {
          setTagNames(res);
        } else {
          setTagNames([]);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };
    fetchData();
  });

  return {
    tagNames,
  };
};

export default useTagNames;
