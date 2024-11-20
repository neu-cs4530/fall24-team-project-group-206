/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import useTagNames from '../../../../hooks/useTagNames';
import { auth } from '../../../../firebaseConfig';
import { updateUserTags } from '../../../../services/userService'; // Import the userService function
import logo from '../../../../logo.svg';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Depicts tags that the user can search through and choose from.
 */
const ChooseTagsPage = () => {
  const { user } = useUserContext();
  const { tagNames } = useTagNames();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTagClick = (tagName: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagName)) {
        return prevTags.filter(tag => tag !== tagName);
      }
      return [...prevTags, tagName];
    });
  };

  const saveTagsToUserAccount = async (tags: string[]) => {
    try {
      const currUser = auth.currentUser;
      if (currUser) {
        console.log('Saving tags for user:', currUser.email);
        await updateUserTags(currUser.email!, tags);
        console.log('Tags updated successfully:');
      } else {
        console.error('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const filteredTags = tagNames.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='container'>
      <img src={logo} alt='Fake Stack Overflow Logo' className='logo-login' />
      <div className='title'>
        <h2>what topics interest you? choose tags below:</h2>
      </div>
      <input
        type='text'
        className='search-bar'
        placeholder='Search tags...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className='tag-list'>
        {filteredTags &&
          filteredTags.map(tag => (
            <li
              className={`tag-pill ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}>
              {tag.name}
            </li>
          ))}
      </div>
      <div className='button-container'>
        <button
          className='next-button'
          onClick={() => {
            console.log('Saving tags:', selectedTags);
            saveTagsToUserAccount(selectedTags);
          }}>
          <NavLink className='button-text' to='/new/tagselection/communityselection'>
            Next
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default ChooseTagsPage;
