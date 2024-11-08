import React from 'react';
import './index.css';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const { tagNames } = useTagNames();
  console.log(tagNames);
  return (
    <div className='container'>
      <div className='title'>
        <h2>what topics interest you? choose tags below:</h2>
      </div>
      <div className='status-info'>
        <ul>{tagNames && tagNames.map((tag, index) => <li key={index}>{tag.name}</li>)}</ul>
      </div>
      {/* <ul className='tag-list'>
        {tagNames &&
          tagNames.map((tag, index) => (
            <li key={index}>
              <button className='tag-pill'>Here {tag.name}</button>
            </li>
          ))}
      </ul> */}
      <button className='next-button'>next</button>
    </div>
  );
};

export default ChooseTagsPage;
