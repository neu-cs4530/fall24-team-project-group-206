import React, { useEffect, useState } from 'react';
import { getCommunityQuestions } from '../../../../../services/communityService';
import { Question } from '../../../../../types';
import QuestionView from '../../../questionPage/question';
import useUserContext from '../../../../../hooks/useUserContext';

/**
 * CommunityQuestions component fetches and displays the list of questions
 * for the community that the current user is part of.
 */
const CommunityQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, socket } = useUserContext();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log(`Fetching questions for community: ${user.community}`);
        const fetchedQuestions = await getCommunityQuestions(user.community);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    if (user.community) {
      fetchQuestions();
    }
  }, [user.community]);

  useEffect(() => {
    if (!socket || !user.community) return;
    // socket.on('communityUpdate', handleCommunityUpdate);

    // eslint-disable-next-line consistent-return
    return () => {
      // socket.off('communityUpdate', handleCommunityUpdate);
    };
  }, [socket, user.community]);

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      {questions.length > 0 ? (
        questions.map(q => <QuestionView key={q._id} q={q} />)
      ) : (
        <p>No questions available for this community.</p>
      )}
    </div>
  );
};

export default CommunityQuestions;
