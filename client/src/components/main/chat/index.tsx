import React, { useRef, useState } from 'react';
import './index.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const ChatPage = () => {
  // This doesn't work
  const scrollUp = () => {
    window.scrollY += 100;
  };

  // This doesnt work
  const scrollDown = () => {
    window.scrollY -= 100;
  };

  return (
    <div className='chat-container'>
      <div className='chat-header'>
        chatting now:{' '}
        <input className='username' id='searchBar' placeholder='username' type='text' />
      </div>
      <div className='ruled-paper'>
        <span className='chat-text-user'>hi</span> <br /> <br />
        <span className='chat-text-me'>hey, how are you?</span>
      </div>
      <div className='chat-footer d-flex'>
        <div className='carrot p-2'>
          <FaCaretUp size={45} onClick={scrollUp} />
          <FaCaretDown size={45} onClick={scrollDown} />
        </div>
        <input className='p-2 message' id='searchBar' placeholder='type message here' type='text' />
        <button className='send p-2'>send</button>
      </div>
    </div>
  );
};
export default ChatPage;
