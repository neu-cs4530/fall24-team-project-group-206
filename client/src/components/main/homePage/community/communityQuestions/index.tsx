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
  const { user } = useUserContext();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getCommunityQuestions(user.community);
        // console.log(fetchedQuestions);
        setQuestions(fetchedQuestions);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    if (user.community) {
      fetchQuestions();
    }
  }, [user.community]);

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
