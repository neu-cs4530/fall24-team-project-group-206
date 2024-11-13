/* eslint-disable no-console */
import React, { useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
// eslint-disable-next-line import/no-extraneous-dependencies
import useTagNames from '../../../../hooks/useTagNames';
import { db, auth } from '../../../../firebaseConfig';
import logo from '../../../../logo.svg';

/**
 * Depicts tags that the user can search through and choose from.
 */
const ChooseTagsPage = () => {
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
      const user = auth.currentUser;
      if (user) {
        console.log(user.email);
        if (user.email) {
          const userRef = doc(db, 'users', user.email);
          await updateDoc(userRef, { tags });
        } else {
          console.error('Error saving tags');
        }
      } else {
        console.error('Error saving tags');
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
