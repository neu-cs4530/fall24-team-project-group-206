// CommunityHomePage.tsx
import './index.css';
import React from 'react';
import { Link } from 'react-router-dom';
import MembersSidebar from './membersSideBar';
import CommunityQuestions from './communityQuestions'; // Import the new CommunityQuestions component

/**
 * CommunityHomePage component renders a page displaying the user's community
 * and questions related to that community.
 */
const CommunityHomePage = () => (
  // Use the userCommunity (the name of the current community)
  <div className='home-page-container'>
    {/* Display the dynamic title for the community */}
    <h2 className='home-page-title'>Community Home</h2>
    <hr />
    {/* Sidebar for members */}
    <MembersSidebar />
    {/* Button to chat with the community */}
    <Link className='chat-button' to={`/chat/community/${localStorage.getItem('communityName')}`}>
      Chat with Community
    </Link>
    {/* Display the community questions */}
    <CommunityQuestions /> {/* Render the CommunityQuestions component */}
  </div>
);
export default CommunityHomePage;
