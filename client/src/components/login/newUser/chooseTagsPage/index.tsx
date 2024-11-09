import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const { tagNames } = useTagNames();
  return (
    <div className='container'>
      <h2 className='title'>what topics interest you? choose tags below:</h2>
      <div className='tag-list'>
        {tagNames &&
          tagNames.map((tag, index) => (
            <div className='tag-pill' key={index}>
              {tag.name}
            </div>
          ))}
      </div>
      <div className='button-container'>
        <button className='next-button'>
          <NavLink className='button-text' to='/chooseCommunity'>
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default ChooseTagsPage;
