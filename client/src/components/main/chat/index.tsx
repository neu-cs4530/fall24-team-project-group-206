import './index.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import Message from './Message';
import useChat from '../../../hooks/useChat';

const ChatPage = () => {
  const { pathname } = useLocation();
  const { community } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSelectUser = (email: string) => {
    setSearchTerm(email);
    // setSendTo(email);
  };

  const {
    currentMessage,
    messages,
    send,
    handleSendTo,
    handleInputChange,
    scrollUp,
    saveMessagesToUserAccount,
    scrollDown,
    listOfUsers,
  } = useChat();

  console.log(listOfUsers);

  return (
    <div className='chat-container'>
      <div className='chat-header d-flex'>
        {pathname.includes('community') ? (
          <span className='chat-title'>
            chatting now: <span className='community-title'>{community}</span>
          </span>
        ) : (
          <>
            {/* <div className='chat-title'> */}
            <span className='chat-title'>chatting now: </span>
            <input
              className='username'
              id='searchBar'
              placeholder='username'
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && listOfUsers?.length > 0 ? (
              <ul className='dropdown-list'>
                {listOfUsers.map((currUser: string) => (
                  <li key={currUser} onClick={() => handleSelectUser(currUser)}>
                    {currUser}
                  </li>
                ))}
              </ul>
            ) : (
              'none'
            )}

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
