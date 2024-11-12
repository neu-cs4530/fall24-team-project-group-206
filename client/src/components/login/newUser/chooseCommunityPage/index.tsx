import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './index.css';

const PostLoginCommunity = () => {
  const navigate = useNavigate();

  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const toggleCommunitySelection = (community: string) => {
    setSelectedCommunities(prevSelected => {
      if (prevSelected.includes(community)) {
        return prevSelected.filter(item => item !== community);
      }
      return [...prevSelected, community];
    });
  };

  return (
    <div className='community-container'>
      <h2 className='recommendation-header'>
        We recommend the following communities based on your interests:
      </h2>
      <ul className='communities'>
        <li
          className={selectedCommunities.includes('Community') ? 'selected' : ''}
          onClick={() => toggleCommunitySelection('Community')}
        >
          Community
        </li>
      </ul>
      <p className='choose-more-text'>Not interested? Choose from below:</p>
      <ul className='communities'>
        {['Alt Community 1', 'Alt Community 2', 'Alt Community 3'].map(community => (
          <li
            key={community}
            className={selectedCommunities.includes(community) ? 'selected' : ''}
            onClick={() => toggleCommunitySelection(community)}
          >
            {community}
          </li>
        ))}
      </ul>
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
