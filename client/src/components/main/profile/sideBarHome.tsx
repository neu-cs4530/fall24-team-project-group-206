import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarHome = () => (
  <div id='sideBarHome' className='sideBarHome'>
    <NavLink
      to='/profile/account'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Account
    </NavLink>
    <NavLink
      to='/profile/tags'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Tags
    </NavLink>
    <NavLink
      to='/profile/community'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Community
    </NavLink>
    <NavLink
      to='/profile/status'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Status
    </NavLink>
  </div>
);

export default SideBarHome;
