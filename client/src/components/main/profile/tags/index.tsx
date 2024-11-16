/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import useUserContext from '../../../../hooks/useUserContext';
import useTagNames from '../../../../hooks/useTagNames';
import { db } from '../../../../firebaseConfig';
import './index.css';
/**
 * TagsInfo component which displays and allows the user to manage their chosen tags.
 */
const TagsInfo = () => {
  const { user } = useUserContext();
  const { tagNames } = useTagNames();
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      if (!user?.username) return;

      try {
        const q = query(collection(db, 'users'), where('username', '==', user.username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setChosenTags(userData.tags || []);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [user]);

  const handleTagAdd = (tagName: string) => {
    setChosenTags(prevTags => [...prevTags, tagName]);
  };

  const handleTagRemove = (tagName: string) => {
    setChosenTags(prevTags => prevTags.filter(tag => tag !== tagName));
  };

  const saveTagsToUserAccount = async () => {
    if (!user?.username) return;

    try {
      const userDocRef = doc(db, 'users', user.username);
      await updateDoc(userDocRef, { tags: chosenTags });
      console.log('Tags updated:', chosenTags);
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  const filteredTags = tagNames
    .filter(tag => !chosenTags.includes(tag.name)) // Only show tags not already chosen
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())); // Apply search filter

  return (
    <div className='tags-container'>
      <div className='tags-title'>
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
