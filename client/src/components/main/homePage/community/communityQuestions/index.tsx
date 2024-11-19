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
  const [error, setError] = useState<string>('');

  const { user } = useUserContext(); // Get current user data
  useEffect(() => {
    const fetchQuestions = async () => {
      if (user.community === '') {
        setError('User is not part of any community');
        setLoading(false);
        return;
      }

      try {
        console.log(user.community);
        const fetchedQuestions = await getCommunityQuestions(user.community);
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    if (user.community) {
      fetchQuestions();
    }
  }, [user.community]);

  // Display loading, error, or the list of questions
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {questions.length > 0 ? (
        questions.map(q => (
          <QuestionView key={q._id} q={q} /> // Display each question
        ))
      ) : (
        <p>No questions available for this community.</p>
      )}
    </div>
  );
};

export default CommunityQuestions;
