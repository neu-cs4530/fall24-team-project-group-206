// Import the functions you need from the SDKs you need
// eslint-disable-next-line import/no-extraneous-dependencies
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// eslint-disable-next-line import/no-extraneous-dependencies
import { Auth, getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAJ7XG_hEoABCql3y93uyAsiJOAiePFkOw',
  authDomain: 'fall-24-swe-206.firebaseapp.com',
  projectId: 'fall-24-swe-206',
  storageBucket: 'fall-24-swe-206.firebasestorage.app',
  messagingSenderId: '463281767467',
  appId: '1:463281767467:web:25a18d9ea267bbadae166e',
  measurementId: 'G-GF0H985NDB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line import/prefer-default-export
export { auth, db, firebaseConfig };
