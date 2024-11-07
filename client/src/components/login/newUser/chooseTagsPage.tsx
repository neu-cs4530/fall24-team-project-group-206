import React from 'react';
import './index.css';
import useTagNames from '../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const tagNames = useTagNames();
  return (
    <div className='status-info'>
      <ul>
        console.log(tagNames);
        {/* {tagNames.map(name => (
          <li key={name}> {name} </li>
        ))} */}
      </ul>
    </div>
  );
};

export default ChooseTagsPage;
