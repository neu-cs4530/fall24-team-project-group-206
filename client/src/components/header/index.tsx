/* eslint-disable no-console */
import React from 'react';
import useHeader from '../../hooks/useHeader';
import './index.css';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

  const handleLogout = () => {
    console.log('Logging out');
  };

  return (
    <div id='header' className='header'>
      <button className='logout-button' onClick={handleLogout}>
        Log Out
      </button>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Header;

// commented out code below changes the layout of the header: stack overflow text on the left,
// search bar in the middle, and logout button on the right !!!

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import useHeader from '../../hooks/useHeader';
// import './index.css';

// const Header = () => {
//   const { val, handleInputChange, handleKeyDown } = useHeader();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('userToken');
//     navigate('/login');
//   };

//   return (
//     <div id='header' className='header'>
//       <div className='title'>Fake Stack Overflow</div>
//       <div className='search-container'>
//         <input
//           id='searchBar'
//           placeholder='Search ...'
//           type='text'
//           value={val}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//         />
//       </div>
//       <button className='logout-button' onClick={handleLogout}>
//         Log Out
//       </button>
//     </div>
//   );
// };

// export default Header;
