import React from 'react';
import './index.css';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const tagNames = useTagNames();
  return (
    <div className='container'>
      <div className='title'>
        <h2>what topics interest you? choose tags below:</h2>
      </div>
      <ul className='tag-list'>
        <li>
          <button className='tag-pill'>Task Names</button>
        </li>
        <li>
          <button className='tag-pill'>Task Names</button>
        </li>
      </ul>
      {/* {tagNames.map(name => (
          <li key={name}> {name} </li>
        ))} */}
      <button className='next-button'>next</button>
    </div>
  );
};

export default ChooseTagsPage;
