import React, { useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const SendMessage = async (message: string, sendTo: string) => {
  if (message.trim() === '') {
    alert('Enter valid message');
    return;
  }
  const user = auth.currentUser;
  await addDoc(collection(db, 'messages'), {
    text: message,
    email: user,
    sendTo,
    createdAt: serverTimestamp(),
  });
  // scroll?.current.scrollIntoView({ behavior: "smooth" });
};
export default SendMessage;
