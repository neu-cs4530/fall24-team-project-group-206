import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
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
