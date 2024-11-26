/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import useUserContext from '../../../../hooks/useUserContext';
import useTagNames from '../../../../hooks/useTagNames';
import './index.css';
import { updateUserTags, getUser } from '../../../../services/userService';

/**
 * TagsInfo component which displays and allows the user to manage their chosen tags.
 */
const TagsInfo = () => {
  const { user, setUser } = useUserContext();
  const { tagNames } = useTagNames();
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tags from MongoDB when the component is mounted
  useEffect(() => {
    const fetchTags = async () => {
      if (!user?.username) return;

      try {
        const data = await getUser(user.username); // Fetch user data from MongoDB
        setChosenTags(data.tags || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [user]);

  // Handle adding a tag to the chosen list
  const handleTagAdd = (tagName: string) => {
    setChosenTags(prevTags => [...prevTags, tagName]);
  };

  // Handle removing a tag from the chosen list
  const handleTagRemove = (tagName: string) => {
    setChosenTags(prevTags => prevTags.filter(tag => tag !== tagName));
  };

  const saveTagsToUserAccount = async () => {
    if (!user?.username) return;

    try {
      await updateUserTags(user.username, chosenTags);
      setUser({
        ...user,
        tags: chosenTags,
      });
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const filteredTags = tagNames
    .filter(tag => !chosenTags.includes(tag.name))
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className='tags-container'>
      <div className='tags-main-title'>
        <h2>Your Chosen Tags</h2>
      </div>
      <div className='tags-tag-list'>
        {chosenTags.length > 0 ? (
          chosenTags.map(tag => (
            <div key={tag} className='tags-tag-pill selected' onClick={() => handleTagRemove(tag)}>
              {tag} <span className='tags-tag-pill.selected'></span>
            </div>
          ))
        ) : (
          <p>No tags selected</p>
        )}
      </div>

      <div className='tags-search-title'>
        <h3>Search and Add More Tags</h3>
      </div>
      <input
        type='text'
        className='search-bar-tags-page'
        placeholder='Search tags...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className='tags-tag-list'>
        {filteredTags.map(tag => (
          <div key={tag.name} className='tags-tag-pill' onClick={() => handleTagAdd(tag.name)}>
            {tag.name}
          </div>
        ))}
      </div>

      <button className='save-tags-button' onClick={saveTagsToUserAccount}>
        Save Tags
      </button>
    </div>
  );
};

export default TagsInfo;
