import React, { useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import useTagNames from '../../../../hooks/useTagNames';

/**
 * Depicts tags that the user can choose from.
 */
const ChooseTagsPage = () => {
  const { tagNames } = useTagNames();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tagName: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagName)) {
        return prevTags.filter(tag => tag !== tagName);
      }
      return [...prevTags, tagName];
    });
  };

  return (
    <div className='container'>
      <div className='title'>
        <h2>What topics interest you? Choose tags below:</h2>
      </div>
      <div className='tag-list'>
        <ul>
          {tagNames &&
            tagNames.map(tag => (
              <li
                className={`tag-pill ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}>
                {tag.name}
              </li>
            ))}
        </ul>
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
