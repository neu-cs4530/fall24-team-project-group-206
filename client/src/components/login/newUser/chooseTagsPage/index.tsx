import React from 'react';
import './index.css';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const tagNames = useTagNames();
  return (
    <div>
      <h1>what topics interest you? choose tags below:</h1>
      <ul>
        <li>
          <button>Task Names</button>
        </li>
        {/* {tagNames.map(name => (
          <li key={name}> {name} </li>
        ))} */}
      </ul>
      <button>next</button>
    </div>
  );
};

export default ChooseTagsPage;
