import './index.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.svg';

/**
 * Initial page that leads users to a sign in page if they're already a user or a create account if
 * they aren't.
 */
const UserSelection = () => {
  const navigate = useNavigate();

  const handleNewUserClick = () => {
    navigate('/new');
  };

  const handleExistingUserClick = () => {
    navigate('/existing');
  };

  return (
    <div className='container'>
      <img src={logo} alt='code quest logo' className='logo-login' />
      <h2>Welcome to CodeQuest!</h2>
      <div className='button-group'>
        <button type='button' className='user-button' onClick={handleNewUserClick}>
          New User
        </button>
        <button type='button' className='user-button' onClick={handleExistingUserClick}>
          Existing User
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
