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
      <div className='title'>
        <h2>what topics interest you? choose tags below:</h2>
      </div>
      <div className='tag-list'>
        <ul>
          {tagNames &&
            tagNames.map((tag, index) => (
              <li className='tag-pill' key={index}>
                {tag.name}
              </li>
            ))}
        </ul>
      </div>
      {/* <ul className='tag-list'>
        {tagNames &&
          tagNames.map((tag, index) => (
            <li key={index}>
              <button className='tag-pill'>Here {tag.name}</button>
            </li>
          ))}
      </ul> */}
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
