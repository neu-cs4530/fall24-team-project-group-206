/* eslint-disable no-console */
import React, { useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../../firebaseConfig';
import logo from '../../../../logo.svg';
import useCommunityNames from '../../../../hooks/useCommunityNames';

/**
 * Depicts communities that the user can choose from.
 */
const ChooseCommunityPage = () => {
  const { communityNames } = useCommunityNames();
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');

  const handleCommunityClick = (communityName: string) => {
    setSelectedCommunity(prevCommunity => (prevCommunity === communityName ? '' : communityName));
  };

  const saveCommunityToUserAccount = async (community: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log(user.email);
        if (user.email) {
          const userRef = doc(db, 'users', user.email);
          await setDoc(
            userRef,
            {
              username: user.email,
              community,
            },
            { merge: true },
          );
        } else {
          console.error('Error saving community');
        }
      } else {
        console.error('Error saving community');
      }
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  return (
    <div className='community-container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='recommendation-header'>
        <h2>Recommended Communities:</h2>
      </div>
      <div className='community-list'>
        {communityNames &&
          communityNames.map(community => (
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
