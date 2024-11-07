import React from 'react';
import './index.css';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  const { tagNames } = useTagNames();
  // const tagNames = useTagNames();
  // console.log(tagNames);

  return (
    <div className='status-info'>
      <ul>{tagNames && tagNames.map((tag, index) => <li key={index}>{tag.name}</li>)}</ul>
    </div>
  );
};
export default ChooseTagsPage;
