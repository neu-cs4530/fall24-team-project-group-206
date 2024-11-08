import React from 'react';
import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * StatusInfo component which displays the user's status.
 */
const ChooseTagsPage = () => {
  // const navigate = useNavigate();
  const tagNames = useTagNames();

  // const handleNextClick = () => {
  //   navigate('/chooseCommunity');
  // };
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
      <button>
        <NavLink to='/chooseCommunity'>Next</NavLink>
      </button>
    </div>
  );
};

export default ChooseTagsPage;
