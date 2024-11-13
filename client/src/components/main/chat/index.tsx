import React, { useEffect, useState } from 'react';
import './index.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { query, collection, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Message from './Message';
import useUserContext from '../../../hooks/useUserContext';

const ChatPage = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [send, setSend] = useState<string>('');

  // ALSO NEEDS TO UPDATE THE MESSAGES SEEN
  const handleSendTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSend(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const saveMessagesToUserAccount = async (message: string, sendTo: string) => {
    try {
      if (user && user.username) {
        await addDoc(collection(db, 'messages'), {
          username: user.username,
          message,
          sendTo,
          timestamp: new Date(),
        });
        setCurrentMessage(''); // Clear the input after sending
      } else {
        console.error('User not authenticated or username missing');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  useEffect(() => {
    if (!user?.username) return;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const loadedMessages = querySnapshot.docs.map(doc => doc.data().message);
      setMessages(loadedMessages);
    });

    // eslint-disable-next-line consistent-return
    return unsubscribe; // Cleanup on component unmount
  }, [user]);

  const scrollUp = () => {
    window.scrollBy(0, -100);
  };

  const scrollDown = () => {
    window.scrollBy(0, 100);
  };

  return (
    <div className='chat-container'>
      <div className='chat-header'>
        chatting now:{' '}
        <input
          className='username'
          id='searchBar'
          placeholder={pathname.includes('community') ? 'community' : 'email'}
          type='text'
          onChange={handleSendTo}
        />
      </div>
      <div className='ruled-paper'>
        {messages.map((m, index) => (
          <>
            <Message key={index} message={m} username={user?.username} />
            <br /> <br />
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
