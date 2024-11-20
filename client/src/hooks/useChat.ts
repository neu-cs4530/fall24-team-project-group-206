/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useLocation, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { getListOfAllUsers } from '../services/userService';
import { db } from '../firebaseConfig';
import { User } from '../types';

const useChat = () => {
  const { pathname } = useLocation();
  const { community } = useParams();
  const { user } = useUserContext();
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ message: string; username: string; sendTo: string }[]>(
    [],
  );
  const [send, setSend] = useState<string>('');
  const messageContainer = document.querySelector('.scrollable-container');
  const [listOfUsers, setListOfUsers] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await getListOfAllUsers();
      const usernames = Array.isArray(result) ? result.map((u: User) => u.username) : [];
      setListOfUsers(usernames);
    } catch (err) {
      console.error('Error fetching list of users:', err);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on mount
  }, []);

  useEffect(() => {
    if (pathname.includes('community')) {
      setSend(community || '');
    }
  }, [community, pathname, setSend]);

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
      }
    } catch (error) {
      console.error('Error saving message or user does not exist:', error);
    }
  };

  useEffect(() => {
    if (!user?.username) return;

    // Query to retrieve messages where the current user is either the sender (username) or receiver (sendTo)
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    if (pathname.includes('community') && community) {
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const loadedMessages = querySnapshot.docs
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .map(doc => ({
            message: doc.data().message,
            username: doc.data().username,
            sendTo: doc.data().sendTo,
            timestamp: doc.data().timestamp,
          }))
          .filter(msg => msg.sendTo === community);
        setMessages(loadedMessages);
      });

      // eslint-disable-next-line consistent-return
      return () => unsubscribe();
    }

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

    // eslint-disable-next-line consistent-return
    return () => unsubscribe();
  }, [user, send, pathname, community]);

  const scrollUp = () => {
    messageContainer?.scrollBy(0, -100);
  };

  const scrollDown = () => {
    messageContainer?.scrollBy(0, 100);
  };

  return {
    user,
    currentMessage,
    messages,
    send,
    handleSendTo,
    handleInputChange,
    scrollUp,
    saveMessagesToUserAccount,
    scrollDown,
    listOfUsers,
  };
};

export default useChat;
