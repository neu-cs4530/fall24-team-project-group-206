/* eslint-disable consistent-return */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useLocation, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { getListOfAllUsers } from '../services/userService';
import { db } from '../firebaseConfig';
import { User } from '../types';

/**
 * Custom hook to handle chat functionality.
 *
 * @returns pathname - The current URL pathname.
 * @returns community - The current community name retrieved from the URL parameters.
 * @returns user - The current user object.
 * @returns currentMessage - The current message being typed by the user.
 * @returns messages - The list of messages between the current user and the selected user.
 * @returns send - The username of the user to send the message to.
 * @returns handleInputChange - Function to handle changes to the current message input.
 * @returns scrollUp - Function to scroll up in the chat window.
 * @returns saveMessagesToUserAccount - Function to save the current message to the user's account.
 * @returns scrollDown - Function to scroll down in the chat window.
 * @returns handleUserClick - Function to handle the selection of a user from the dropdown.
 * @returns dropdownOpen - The current state of the dropdown menu.
 * @returns selectedUsers - The list of selected users.
 * @returns handleSearchChange - Function to handle changes to the search input.
 * @returns filteredUsers - The list of users filtered by the search term.
 * @returns setDropdownOpen - Function to set the state of the dropdown menu.
 * @returns searchTerm - The current search term.
 */
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
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedUsers] = useState<string[]>([]);

  const filteredUsers = listOfUsers
    .filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(curr => curr.toLowerCase() !== user.username);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSend(e.target.value);
    setSearchTerm(e.target.value);
    setDropdownOpen(true); // Open the dropdown when typing
  };

  const handleUserClick = (username: string) => {
    setSend(username);
    setSearchTerm(username);
    setDropdownOpen(false); // Close the dropdown after selection
  };

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
      setSearchTerm(community || '');
    }
  }, [community, pathname, setSend, setSearchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };

  const saveMessagesToUserAccount = async (message: string, sendTo: string) => {
    try {
      if (
        user &&
        user.username &&
        ((listOfUsers.includes(sendTo) && listOfUsers.includes(searchTerm)) || community)
      ) {
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
          .map(doc => ({
            message: doc.data().message,
            username: doc.data().username,
            sendTo: doc.data().sendTo,
            timestamp: doc.data().timestamp,
          }))
          .filter(msg => msg.sendTo === community);
        setMessages(loadedMessages);
      });

      return () => unsubscribe();
    }

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const loadedMessages = querySnapshot.docs
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

    return () => unsubscribe();
  }, [user, send, pathname, community]);

  const scrollUp = () => {
    messageContainer?.scrollBy(0, -100);
  };

  const scrollDown = () => {
    messageContainer?.scrollBy(0, 100);
  };

  return {
    pathname,
    community,
    user,
    currentMessage,
    messages,
    send,
    handleInputChange,
    scrollUp,
    saveMessagesToUserAccount,
    scrollDown,
    handleUserClick,
    dropdownOpen,
    selectedUsers,
    handleSearchChange,
    filteredUsers,
    setDropdownOpen,
    searchTerm,
  };
};

export default useChat;
