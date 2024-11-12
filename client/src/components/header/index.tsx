/* eslint-disable no-console */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import useHeader from '../../hooks/useHeader';
import './index.css';
import logo from '../../logo.svg';

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
      {/* Render SVG logo */}
      <NavLink
        to='/home'
        id='menu_tag'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <span className='icon'>
          <img src={logo} alt='Fake Stack Overflow Logo' className='logo' />
        </span>
      </NavLink>

      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <span className='icon-here'>
        <NavLink
          to='/profile/account'
          id='menu_questions'
          className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
          <FaUser size={35} />
        </NavLink>
      </span>
    </div>
  );
};

export default Header;
