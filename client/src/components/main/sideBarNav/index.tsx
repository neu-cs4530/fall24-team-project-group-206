import React, { useMemo } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaQuestion, FaTag } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import useUserContext from '../../../hooks/useUserContext';

/**
 * The SideBarNav component has menu items and routes the user based on community.
 */
const SideBarNav = () => {
  const { user } = useUserContext();

  const homePath = useMemo(
    () => (user.community ? '/communityHome' : '/defaultHome'),
    [user?.community],
  );

  return (
    <div id='sideBarNav' className='sideBarNav'>
      <NavLink
        to={homePath}
        id='menu_home'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <span className='icon'>
          <IoMdHome size={25} /> HOME
        </span>
      </NavLink>

      <NavLink
        to='/questions'
        id='menu_questions'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <span className='icon'>
          <FaQuestion size={20} /> QUESTIONS
        </span>
      </NavLink>

      <NavLink
        to='/tags'
        id='menu_tags'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <span className='icon'>
          <FaTag size={20} /> TAGS
        </span>
      </NavLink>

      <NavLink
        to='/chat'
        id='menu_chat'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <span className='icon'>
          <IoChatboxEllipsesOutline size={25} /> CHAT
        </span>
      </NavLink>
    </div>
  );
};

export default SideBarNav;
