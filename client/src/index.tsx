import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket } from './types';

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  if (!serverURL) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  useEffect(() => {
    const newSocket = io(serverURL); // Establish the socket connection
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up on unmount
    };
  }, [serverURL]); // Dependencies updated to avoid reconnecting unnecessarily

  return (
    <Router>
      {socket ? (
        <FakeStackOverflow socket={socket} />
      ) : (
        <div>Loading...</div> // Show a fallback if the socket hasn't connected yet
      )}
    </Router>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
