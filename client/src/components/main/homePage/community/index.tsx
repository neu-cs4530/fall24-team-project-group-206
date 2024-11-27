import './index.css';
import { Link } from 'react-router-dom';
import MembersSidebar from './membersSideBar';
import CommunityQuestions from './communityQuestions';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Component that renders a page displaying the user's community members
 * and questions related to that community.
 */
const CommunityHomePage = () => {
  const { user } = useUserContext();

  return (
    <div className='home-page-container'>
      <h2 className='home-page-title'>{user.community}</h2>
      <hr />
      <div className='home-content'>
        <div className='sidebar-container'>
          <MembersSidebar />
          <Link className='chat-button' to={`/chat/community/${user.community}`}>
            Chat with Community
          </Link>
        </div>
        <div className='questions-container'>
          <CommunityQuestions />
        </div>
      </div>
    </div>
  );
};

export default CommunityHomePage;
