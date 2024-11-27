/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import useUserContext from '../../../../../hooks/useUserContext';
import { getCommunityMembers } from '../../../../../services/communityService';

const MembersSidebar = () => {
  const { user, socket } = useUserContext();
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user.community) {
        return;
      }
      try {
        console.log(`Fetching members for community: ${user.community}`);
        const fetchedMembers = await getCommunityMembers(user.community);
        setMembers(fetchedMembers);
      } catch (err) {
        console.log('Failed to fetch members');
      }
    };

    if (user.community) {
      fetchMembers();
    }

    const handleCommunityUpdate = (community: { name: string; users: string[] }) => {
      if (community.name === user.community) {
        console.log(`Received update for community: ${community.name}`);
        setMembers(community.users);
      }
    };

    socket.on('communityUpdate', handleCommunityUpdate);
    return () => {
      socket.off('communityUpdate', handleCommunityUpdate);
    };
  }, [user.community, socket]);

  return (
    <div className='members-sidebar'>
      <div className='members-title'>
        <div>MEMBERS:</div>
        <hr className='title-line' />
      </div>
      <div className='members-list'>
        {members.length > 0 ? (
          members.map((member, index) => (
            <div key={index} className='member-item'>
              {member}
            </div>
          ))
        ) : (
          <div>No members found</div>
        )}
      </div>
    </div>
  );
};

export default MembersSidebar;
