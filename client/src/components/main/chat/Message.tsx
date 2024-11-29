import { useLocation } from 'react-router-dom';
import useUserContext from '../../../hooks/useUserContext';

/**
 * The message bubbles that differ in color and position depending on the user.
 * @param param0 takes in the message and username to style and show on the page.
 * @returns The message bubbles.
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
