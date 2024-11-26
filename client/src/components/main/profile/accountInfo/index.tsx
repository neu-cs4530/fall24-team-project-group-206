/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { auth } from '../../../../firebaseConfig';
import { getUser, increaseUserStatus } from '../../../../services/userService';
import { getQuestionsByFilter } from '../../../../services/questionService';
import { Question } from '../../../../types';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * AccountInfo component which displays the user's username and status.
 */
const AccountInfo = () => {
  const { user } = useUserContext();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    status: '',
  });
  const [creationTime, setCreationTime] = useState<string | null>(null);
  const [qualifyModerator, setQualifyModerator] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const updateUserStatus = async () => {
    setUserData(prevData => {
      if (prevData.status === 'moderator') return prevData;
      return { ...prevData, status: 'moderator' };
    });
    await increaseUserStatus(username);
    user.status = 'moderator';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const firebaseUser = auth.currentUser;
      if (firebaseUser && firebaseUser.email) {
        try {
          const data = await getUser(firebaseUser.email);

          setUsername(data.username);

          setUserData({
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
            status: data.status,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();

    // Get account creation time from firebase metadata
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.metadata.creationTime) {
      setCreationTime(new Date(firebaseUser.metadata.creationTime).toLocaleDateString());
    }
  }, []);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        if (userData.status !== 'moderator') {
          const res = await getQuestionsByFilter('newest', '', username);
          console.log(`Fetched questions: ${res.length}`);
          const qualifyingQuestions = res.filter((q: Question) => q.upVotes.length >= 3);
          setQualifyModerator(res.length >= 10 && qualifyingQuestions.length >= 5);
        }
      } catch (error) {
        console.error('Error fetching questions or calculating eligibility:', error);
      }
    };

    fetchAndCalculate();
  }, [userData.status, username]);

  const initials =
    `${userData.first_name?.[0] ?? ''}${userData.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className='account-info'>
      <div className='user-info'>
        <div className='initials-box'>{initials}</div>
        <div className='user-details'>
          <h2>{`${userData.first_name} ${userData.last_name}`}</h2>
          {creationTime && <p className='creation-date'>Account Created On: {creationTime}</p>}
          <div className='username-row'>
            <h4 className='username'>username:</h4>
            <p className='username-info'>{userData.username}</p>
          </div>
          <div className='username-row'>
            <h4 className='username'>status:</h4>
            <p className='username-info'>{userData.status}</p>
          </div>
          {qualifyModerator && userData.status !== 'moderator' && (
            <button onClick={updateUserStatus}>become a moderator</button>
          )}
        </div>
      </div>
      <div className='button-container'>
        <NavLink to='/' className='go-back-button'>
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default AccountInfo;
