import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const PostLoginCommunity = () => {
  const navigate = useNavigate();

  const handleNextPage = () => {
    navigate('/home');
  };

  return (
    <div className='community-container'>
      <h2 className='recommendation-header'>
        We recommend the following communities based on your interests:
      </h2>
      <ul className='communities'>
        <li>Community</li>
      </ul>
      <p className='choose-more-text'>Not interested? Choose from below:</p>
      <ul className='communities'>
        <li>Alt Community 1</li>
        <li>Alt Community 2</li>
        <li>Alt Community 3</li>
      </ul>
      <div className='button-container'>
        <button className='next-button' onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PostLoginCommunity;
