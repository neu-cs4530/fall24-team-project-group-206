import './index.css';
import React from 'react';
import { Link } from 'react-router-dom';
import MembersSidebar from './membersSideBar';
import useQuestionPage from '../../../../hooks/useQuestionPage';
import QuestionView from './questions';

/**
 * CommunityHomePage component renders a page displaying the user's community
 * and questions related to that community based on filters such as order and search terms.
 */
const CommunityHomePage = () => {
  // Use the custom hook to manage the state and fetch community-specific questions
  const { titleText, qlist } = useQuestionPage();

  return (
    <div className='home-page-container'>
      {/* Display the dynamic title for the community */}
      <h2 className='home-page-title'>{titleText}</h2>
      <hr />

      {/* Sidebar for members */}
      <MembersSidebar />
      {/* Button to chat with the community */}
      <button className='chat-button'>Chat with Community</button>

      {/* Display questions related to the community */}
      <div>
        {qlist.length > 0 ? (
          qlist.map(q => (
            <QuestionView key={q._id} q={q} /> // Directly pass q to QuestionView
          ))
        ) : (
          <p>No questions available for this community.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityHomePage;
