import React, { useEffect, useState } from 'react';
import './index.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { query, collection, orderBy, onSnapshot, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Message from './Message';
import useUserContext from '../../../hooks/useUserContext';

const ChatPage = () => {
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ message: string; username: string; sendTo: string }[]>(
    [],
  );
  const [send, setSend] = useState<string>('');
  const messageContainer = document.querySelector('.scrollable-container');

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
    console.log('Messages useEffect triggered');

    if (!user?.username) return;

    // Query to retrieve messages where the current user is either the sender (username) or receiver (sendTo)
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const loadedMessages = querySnapshot.docs
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .map(doc => ({
          message: doc.data().message,
          username: doc.data().username,
          sendTo: doc.data().sendTo,
          timestamp: doc.data().timestamp,
        }))
        .filter(
          msg =>
            (msg.username === user.username && msg.sendTo === send) ||
            (msg.sendTo === user.username && msg.username === send),
        );
      setMessages(loadedMessages);
    });

    // Cleanup the snapshot listener on component unmount
    // eslint-disable-next-line consistent-return
    return () => unsubscribe();
  }, [user, send]);

  const scrollUp = () => {
    messageContainer?.scrollBy(0, -100);
  };

  const scrollDown = () => {
    messageContainer?.scrollBy(0, 100);
  };

  return (
    <div className='chat-container'>
      <div className='chat-header d-flex'>
        <span className='chat-title'>chatting now: </span>
        {pathname.includes('community') ? (
          <span>community</span>
        ) : (
          <input
            className='username'
            id='searchBar'
            placeholder={'email'}
            type='text'
            onChange={handleSendTo}
          />
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
