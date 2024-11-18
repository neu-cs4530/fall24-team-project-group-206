/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
// /* eslint-disable no-console */
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Answer, Community, OrderType, Question } from '../types';
import { getQuestionById, getQuestionsByFilter } from '../services/questionService';
import { getCommunityByName } from '../services/communityService';
import { getUser } from '../services/userService';

/**
 * Custom hook for managing the question page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the question page
 * @returns qlist - The list of questions to display
 * @returns setQuestionOrder - Function to set the sorting order of questions (e.g., newest, oldest).
 */
const useQuestionPage = () => {
  const { socket, user } = useUserContext();
  const [searchParams] = useSearchParams();
  const [titleText, setTitleText] = useState<string>('All Questions');
  const [search, setSearch] = useState<string>('');
  const [questionOrder, setQuestionOrder] = useState<OrderType>('newest');
  const [qlist, setQlist] = useState<Question[]>([]);
  const [community, setCommunity] = useState<Community | null>(null);
  const [userCommunity, setUserCommunity] = useState<string>('');

  // const community = user?.community || '';

  useEffect(() => {
    const fetchUserCommunityQuestions = async () => {
      if (!user?.username) return;

      try {
        // Fetch user data to get the community
        const data = await getUser(user.username); // Fetch user data from MongoDB
        setUserCommunity(data.community || '');

        // Fetch questions for the user's community
        if (data.community) {
          const questions = await getQuestionsByFilter(questionOrder, search, data.community); // Fetch questions based on community
          setQlist(questions || []);
        }
      } catch (error) {
        console.error('Error fetching community or questions:', error);
      }
    };

    fetchUserCommunityQuestions();
  }, [user, questionOrder, search]);

  // useEffect(() => {
  //   let pageTitle = 'All Questions';
  //   let searchString = '';
  //   // const communityName = searchParams.get('communityName');
  //   const searchQuery = searchParams.get('search');
  //   const tagQuery = searchParams.get('tag');
  //   // const communityQuery = searchParams.get('community');

  //   console.log('checking user', user);
  //   if (user.community) {
  //     pageTitle = user.community;
  //     console.log('community:', pageTitle);
  //     getCommunityByName(pageTitle)
  //       .then(fetchedCommunity => {
  //         setCommunity(fetchedCommunity);

  //         const questionIdsAsStrings = fetchedCommunity.questions.map(id => id.toString());
  //         const fetchQuestions = async () => {
  //           try {
  //             const questions = await Promise.all(
  //               questionIdsAsStrings.map(async qid => {
  //                 const question = await getQuestionById(qid, user.username);
  //                 return question;
  //               }),
  //             );
  //             setQlist(questions);
  //           } catch (error) {
  //             console.error('Error fetching questions:', error);
  //           }
  //         };
  //         fetchQuestions();
  //       })
  //       .catch(error => console.error('Error fetching community:', error));
  //   } else {
  //     setCommunity(null);
  //     if (searchQuery) {
  //       pageTitle = 'Search Results';
  //       searchString = searchQuery;
  //     } else if (tagQuery) {
  //       pageTitle = tagQuery;
  //       searchString = `[${tagQuery}]`;
  //     }
  //   }

  //   setTitleText(pageTitle);
  //   setSearch(searchString);
  // }, [searchParams]);

  useEffect(() => {
    let pageTitle = 'All Questions';
    let searchString = '';

    const searchQuery = searchParams.get('search');
    const tagQuery = searchParams.get('tag');

    if (searchQuery) {
      pageTitle = 'Search Results';
      searchString = searchQuery;
    } else if (tagQuery) {
      pageTitle = tagQuery;
      searchString = `[${tagQuery}]`;
    }

    setTitleText(pageTitle);
    setSearch(searchString);
  }, [searchParams]);

  useEffect(() => {
    // /**
    //  * Function to fetch questions based on the filter and update the question list.
    //  */
    // const fetchData = async () => {
    //   try {
    //     if (!community) {
    //       const res = await getQuestionsByFilter(questionOrder, search);
    //       setQlist(res || []);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchData();

    /**
     * Function to handle question updates from the socket.
     *
     * @param question - the updated question object.
     */
    const handleQuestionUpdate = (question: Question) => {
      setQlist(prevQlist => {
        const questionExists = prevQlist.some(q => q._id === question._id);

        if (questionExists) {
          // Update the existing question
          return prevQlist.map(q => (q._id === question._id ? question : q));
        }

        return [question, ...prevQlist];
      });
    };

    /**
     * Function to handle answer updates from the socket.
     *
     * @param qid - The question ID.
     * @param answer - The answer object.
     */
    const handleAnswerUpdate = ({ qid, answer }: { qid: string; answer: Answer }) => {
      setQlist(prevQlist =>
        prevQlist.map(q => (q._id === qid ? { ...q, answers: [...q.answers, answer] } : q)),
      );
    };

    /**
     * Function to handle views updates from the socket.
     *
     * @param question - The updated question object.
     */
    const handleViewsUpdate = (question: Question) => {
      setQlist(prevQlist => prevQlist.map(q => (q._id === question._id ? question : q)));
    };

    // fetchData();

    socket.on('questionUpdate', handleQuestionUpdate);
    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);

    return () => {
      socket.off('questionUpdate', handleQuestionUpdate);
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
    };
  }, [questionOrder, search, socket, community]);

  return { titleText, qlist, setQuestionOrder };
};

export default useQuestionPage;
