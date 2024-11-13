/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import './index.css';

/**
 * CommunityInfo component which displays the community (if applicable) that they are in.
 */
const CommunityInfo = ({ userId }: { userId: string }) => {
  const [userCommunity, setUserCommunity] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCommunity = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const community = userData.selectedCommunities || 'No community selected';
          setUserCommunity(community);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user community:', error);
      }
    };

    fetchUserCommunity();
  }, [userId]);

  return (
    <div className='community-info'>
      <p>
        {userCommunity
          ? `You are in the community: ${userCommunity}`
          : 'You are not in any community'}
      </p>
    </div>
  );
};

export default CommunityInfo;
