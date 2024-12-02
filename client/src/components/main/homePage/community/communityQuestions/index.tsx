/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { getCommunityQuestions } from '../../../../../services/communityService';
import { Question } from '../../../../../types';
import QuestionView from '../../../questionPage/question';
import useUserContext from '../../../../../hooks/useUserContext';

/**
 * Component that fetches and displays the list of questions for the community that the
 * current user is part of.
 */
const CommunityQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, socket } = useUserContext();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (user.community) {
          const fetchedQuestions = await getCommunityQuestions(user.community);
          setQuestions(fetchedQuestions);
        }
      } catch (err) {
        console.error('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    /**
     * Handles the update of questions for the community that the user is part of.
     * @param community - The community that the question update is for.
     */
    const handleCommunityQuestionUpdate = (community: { name: string; questions: Question[] }) => {
      if (community.name === user.community) {
        setQuestions(community.questions);
      }
    };

    socket.on('communityQuestionUpdate', handleCommunityQuestionUpdate);

    return () => {
      socket.off('communityQuestionUpdate', handleCommunityQuestionUpdate);
    };
  }, [user.community, socket]);

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      {questions.length > 0 ? (
        questions.map(q => <QuestionView key={q._id} q={q} inCommunity={true} />)
      ) : (
        <p>No questions available for this community.</p>
      )}
    </div>
  );
};

export default CommunityQuestions;
