import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from 'firebaseConfig';

const SendMessage = () => {
  const [message, sentMessage] = useState('');

  return (
    <form className='send-message'>
      <label htmlFor='messageInput' hidden>
        Enter Message
      </label>
      <input
        id='messageInput'
        name='messageInput'
        type='text'
        className='form-input__input'
        placeholder='type message...'
      />
      <button type='submit'>Send</button>
    </form>
  );
};
export default SendMessage;
