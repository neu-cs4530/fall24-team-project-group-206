import './index.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import Message from './Message';
import useChat from '../../../hooks/useChat';

const ChatPage = () => {
  const { pathname } = useLocation();
  const { community } = useParams();

  const {
    currentMessage,
    messages,
    send,
    handleSendTo,
    handleInputChange,
    scrollUp,
    saveMessagesToUserAccount,
    scrollDown,
  } = useChat();

  return (
    <div className='chat-container'>
      <div className='chat-header d-flex'>
        {pathname.includes('community') ? (
          <span className='chat-title'>
            chatting now: <span className='community-title'>{community}</span>
          </span>
        ) : (
          <>
            <span className='chat-title'>chatting now: </span>
            <input
              className='username'
              id='searchBar'
              placeholder={'email'}
              type='text'
              onChange={handleSendTo}
            />
          </>
        )}
      </div>
      <div className='ruled-paper scrollable-container'>
        {messages.map((m, index) => (
          <>
            <Message key={index} message={m.message} username={m.username} />
            <br />
          </>
        ))}
      </div>
      <div className='chat-footer d-flex'>
        <div className='carrot p-2'>
          <FaCaretUp size={45} onClick={scrollUp} />
          <FaCaretDown size={45} onClick={scrollDown} />
        </div>
        <input
          className='p-2 message'
          id='searchBar'
          placeholder='type message here'
          type='text'
          value={currentMessage}
          onChange={handleInputChange}
        />
        <button
          className='send p-2'
          onClick={() => saveMessagesToUserAccount(currentMessage, send)}>
          send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
