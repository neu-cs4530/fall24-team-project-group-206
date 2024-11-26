/* eslint-disable no-console */
import React, { useState } from 'react';
import './index.css';
import { FiEdit } from 'react-icons/fi';
import { handleHyperlink } from '../../../../tool';
import { editQuestion } from '../../../../services/questionService';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  questionId: string;
  inCommunity?: boolean;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ views, text, askby, meta, questionId, inCommunity }: QuestionBodyProps) => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await editQuestion(questionId, editedText, user.username);
      setIsEditing(false);
      setEditedText(response.text);
    } catch (error) {
      console.error('Error editing question:', error);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  //   return (
  //     <div id='questionBody' className='questionBody right_padding'>
  //       <div className='bold_title answer_question_view'>{views} views</div>
  //       <div className='answer_question_text'>{handleHyperlink(text)}</div>
  //       <div className='answer_question_right'>
  //         <div className='question_author'>{askby}</div>
  //         <div className='answer_question_meta'>asked {meta}</div>
  //         <button onClick={handleEditClick}>Edit</button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div id='questionBody' className='questionBody right_padding'>
      <div className='bold_title answer_question_view'>{views} views</div>
      {isEditing ? (
        <div>
          <textarea value={editedText} onChange={handleTextChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className='answer_question_text'>{handleHyperlink(text)}</div>
      )}
      <div className='answer_question_right'>
        <div className='question_author'>{askby}</div>
        <div className='answer_question_meta'>asked {meta}</div>
        {user.status === 'moderator' && inCommunity && (
          <>
            {!isEditing && (
              <button onClick={handleEditClick} className='edit-icon-button'>
                <FiEdit size={20} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionBody;
