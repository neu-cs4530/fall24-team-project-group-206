import { useLocation } from 'react-router-dom';
import useUserContext from '../../../hooks/useUserContext';

/**
 * How a message is stored.
 * @param message Message being sent
 * @param username Username of current user
 */
const Message = ({ message, username }: { message: string; username: string }) => {
  const { user } = useUserContext();
  const { pathname } = useLocation();

  return (
    <>
      <div className={`${username === user?.username ? 'chat-text-me' : 'chat-text-user'}`}>
        {pathname.includes('community') && (
          <p className={`${username === user?.username ? 'user-name-me' : 'user-name'}`}>
            {username}
          </p>
        )}
        <p className='message'>{message}</p>
      </div>
      <br />
      <br />
    </>
  );
};

export default Message;
