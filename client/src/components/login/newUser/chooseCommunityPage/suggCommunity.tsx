/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { collection, query, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';
import { db } from '../../../../firebaseConfig';
import './index.css';

const PostLoginCommunity = ({ userId }: { userId: string }) => {
  const [userTags, setUserTags] = useState<string[]>([]);
  const [suggestedCommunities, setSuggestedCommunities] = useState<string[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTags = async () => {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserTags(docSnap.data().tags || []);
      } else {
        console.log('User not found!');
      }
    };

    fetchUserTags();
  }, [userId]);

  useEffect(() => {
    if (userTags.length === 0) return;

    const fetchSuggestedCommunities = async () => {
      const communitiesRef = collection(db, 'communities');
      const q = query(communitiesRef);

      const querySnapshot = await getDocs(q);
      const matchedCommunities: string[] = [];

      // eslint-disable-next-line @typescript-eslint/no-shadow
      querySnapshot.forEach(doc => {
        const community = doc.data();
        const commonTags = community.tags.filter((tag: string) => userTags.includes(tag));

        // if there are common tags with a community, suggest that community
        if (commonTags.length > 0) {
          matchedCommunities.push(doc.id);
        }
      });

      setSuggestedCommunities(matchedCommunities);
    };

    fetchSuggestedCommunities();
  }, [userTags]);

  const handleCommunitySelect = async (community: string) => {
    setSelectedCommunity(community);
    const userRef = doc(db, 'users', userId);

    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        console.log('User not found!');
        return;
      }
      const userData = docSnap.data();
      const selectedCommunities = userData.selectedCommunities || [];

      // users can only select one community:
      if (selectedCommunities.length === 0 || selectedCommunities[0] !== community) {
        await updateDoc(userRef, {
          selectedCommunities: [community],
        });
        console.log(`Community "${community}" added to user's selected communities`);
      } else {
        console.log(`Community "${community}" is already selected.`);
      }
    } catch (error) {
      console.error('Error adding community to user:', error);
    }
  };

  return (
    <div className='community-container'>
      <h2 className='recommendation-header'>
        We recommend the following communities based on your interests:
      </h2>
      <ul className='communities'>
        {suggestedCommunities.map(community => (
          <li
            key={community}
            onClick={() => handleCommunitySelect(community)}
            className={selectedCommunity === community ? 'selected' : ''}>
            {community}
          </li>
        ))}
      </ul>
      <p className='choose-more-text'></p>
      <div className='button-container'>
        <button className='next-button'>
          <NavLink className='button-text' to='/home'>
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default PostLoginCommunity;
