/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { IoMdHome } from 'react-icons/io';
import { FaQuestion, FaTag } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => (
  <div id='sideBarNav' className='sideBarNav'>
    <NavLink
      to='/profile'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
    >
      <span className='icon'>
        <CgProfile size={25} /> PROFILE
      </span>
    </NavLink>
    <NavLink
      to='/home'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
    >
      <span className='icon'>
        <IoMdHome size={25} /> HOME
      </span>
    </NavLink>
    <NavLink
      to='/questions'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
    >
      <span className='icon'>
        <FaQuestion size={20} /> QUESTIONS
      </span>
    </NavLink>
    <NavLink
      to='/tags'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
    >
      <span className='icon'>
        <FaTag size={20} /> TAGS
      </span>
    </NavLink>
    <NavLink
      to='/chat'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}
    >
      <span className='icon'>
        <IoChatboxEllipsesOutline size={25} /> CHAT
      </span>
    </NavLink>
  </div>
);

export default SideBarNav;
