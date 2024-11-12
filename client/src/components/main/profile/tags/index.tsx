/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import useUserContext from '../../../../hooks/useUserContext';
import { db } from '../../../../firebaseConfig';
import './index.css';

/**
 * TagsInfo component which displays the user's tags.
 */
const TagsInfo = () => {
  const { user } = useUserContext();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      if (!user?.username) return;

      try {
        console.log(user.username);
        const q = query(collection(db, 'users'), where('username', '==', user.username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setTags(userData.tags || []);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [user]);

  return (
    <div className='tags-info'>
      {tags.length > 0 ? (
        <ul>
          {tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : (
        <p>No tags selected</p>
      )}
    </div>
  );
};

export default TagsInfo;
