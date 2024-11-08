import './index.css';
import React from 'react';
import MembersSidebar from './membersSideBar';
import Questions from './questions';

/**
 * CommunityHomePage component renders a page displaying user's community
 * based on filters such as order and search terms.
 */
const CommunityHomePage = () => (
  <div className='home-page-container'>
    <h2 className='home-page-title'>[Insert Community Name]</h2>
    <hr />
    <MembersSidebar />
    <button className='chat-button'>Chat with Community</button>
    <Questions />
  </div>
);
export default CommunityHomePage;
