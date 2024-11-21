/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './layout';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import CreateUser from './login/newUser';
import Login from './login/existingUser';
import UserSelection from './login';
import ProfilePage from './main/profile';
import AccountInfo from './main/profile/accountInfo';
import TagsInfo from './main/profile/tags';
import ChooseTagsPage from './login/newUser/chooseTagsPage/index';
import ChooseCommunityPage from './login/newUser/chooseCommunityPage';
import CommunityHomePage from './main/homePage/community';
import ChatPage from './main/chat';
import DefaultHomePage from './main/homePage/default';
import CommunityInfo from './main/profile/community';
import { checkLoginStatus } from '../utils/authUtils';
import useLoginContext from '../hooks/useLoginContext';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  // const { pathname } = useLocation(); // Get the current path

  if (!user || !socket) {
    // localStorage.setItem('redirectPath', pathname);
    // if (pathname !== '/') {
    //   Cookies.set('redirectPath', pathname, { expires: 7 });
    // }
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to prevent navigation before the user is set
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = Cookies.get('user');
    console.log('Stored User from Cookies:', storedUser);
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User State after setting:', user);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, [user]);

  // useEffect(() => {
  //   // When the user state changes, update cookies
  //   if (user) {
  //     Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Strict' }); // Store user in cookies for 7 days
  //   } else {
  //     Cookies.remove('user'); // Remove user cookie if logged out
  //   }
  // }, [user]);

  // If no user, redirect to login page
  // useEffect(() => {
  //   if (loading) return;
  //   console.log('User State:', user); // Log user state for debugging
  //   if (!user) {
  //     console.warn('No user found. Redirecting to login...');
  //     navigate('/'); // Redirect to login if no user
  //   }
  // }, [user, loading, navigate]);

  // useEffect(() => {
  //   if (user !== null) {
  //     console.log('User State:', user);
  //   }
  // }, [user]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }
  // useEffect(() => {
  //   // Check if the user is stored in cookies
  //   const storedUser = localStorage.getItem('user');
  //   console.log('Stored User:', storedUser);
  //   if (storedUser) {
  //     // Set the user from cookies
  //     setUser(JSON.parse(storedUser));
  //   }

  //   // After the page reload, navigate the user to the previous route if it's stored
  //   const redirectPath = localStorage.getItem('redirectPath');
  //   if (redirectPath) {
  //     // Navigate to the saved path
  //     navigate(redirectPath);
  //     localStorage.removeItem('redirectPath'); // Remove the path after use
  //   } else if (!storedUser) {
  //     // If no user is found, navigate to login page
  //     navigate('/');
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   const storedUser = Cookies.get('user');
  //   const redirectPath = Cookies.get('redirectPath');

  //   if (storedUser) {
  //     // Set user from cookies if exists
  //     setUser(JSON.parse(storedUser));

  //     if (redirectPath) {
  //       // Navigate to the stored path after successful login
  //       navigate(redirectPath);
  //       Cookies.remove('redirectPath'); // Remove redirectPath cookie
  //     } else {
  //       // If no redirectPath, navigate to default page
  //       navigate('/home');
  //     }
  //   } else {
  //     // If no user found, navigate to login
  //     navigate('/');
  //   }
  // }, [navigate]);

  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem('user', JSON.stringify(user)); // Save user data to localStorage
  //     // Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Save user data to cookies
  //     // Cookies.remove('redirectPath');
  //   }
  // }, [user]);

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<UserSelection />} />
        <Route path='/existing' element={<Login />} />
        <Route path='/new' element={<CreateUser />} />
        <Route
          path='/new/tagselection'
          element={
            <ProtectedRoute user={user} socket={socket}>
              <ChooseTagsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/new/tagselection/communityselection'
          element={
            <ProtectedRoute user={user} socket={socket}>
              <ChooseCommunityPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        {
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='communityHome' element={<CommunityHomePage />} />
            <Route path='defaultHome' element={<DefaultHomePage />} />
            <Route path='chat/community/:community' element={<ChatPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='questions' element={<QuestionPage />} />
            <Route path='chat' element={<ChatPage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            <Route path='profile' element={<ProfilePage />}>
              <Route path='account' element={<AccountInfo />} />
              <Route path='tags' element={<TagsInfo />} />
              <Route path='community' element={<CommunityInfo />} />
            </Route>
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
