import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';

const SendMessage = async (message: string, sendTo: string) => {
  if (message.trim() === '') {
    return;
  }
  const user = auth.currentUser;
  await addDoc(collection(db, 'messages'), {
    text: message,
    email: user,
    sendTo,
    createdAt: serverTimestamp(),
  });
};
export default SendMessage;
