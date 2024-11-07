import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostLoginCommunity = () => {
  const navigate = useNavigate();

  const handleNextPage = () => {
    navigate('/profile');
  };

  return (
    <div>
      <h2>Interactive Page</h2>
      <div className='popup-overlay'>
        <div className='popup-content'>
          <h2>Choose your Community</h2>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PostLoginCommunity;
