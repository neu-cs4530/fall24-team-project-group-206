/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './index.css';
import useUserContext from '../../../../../hooks/useUserContext';
import { getCommunityMembers } from '../../../../../services/communityService';
import { User } from '../../../../../types';

const MembersSidebar = () => {
  const { user, socket } = useUserContext();
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // placeholder for now:
  // const members = [
  //   'Member 1',
  //   'Member 2',
  //   'Member 3',
  //   'Member 4',
  //   'Member 5',
  //   'Member 6',
  //   'Member 7',
  //   'Member 8',
  //   'Member 9',
  //   'Member 10',
  //   'Member 11',
  //   'Member 12',
  // ];

  useEffect(() => {
    const fetchMembers = async () => {
      if (!user.community) {
        setError('User is not part of any community');
        setLoading(false);
        return;
      }
      try {
        console.log(`Fetching members for community: ${user.community}`);
        const fetchedMembers = await getCommunityMembers(user.community);
        setMembers(fetchedMembers);
      } catch (err) {
        setError('Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    if (user.community) {
      fetchMembers();
    }
  }, [user.community]);

  // const handleCommunityUpdate = (update: { community: string; members: User[] }) => {
  //   if (update.community === user.community) {
  //     console.log(`Received update for community: ${update.community}`);
  //     setMembers(update.members);
  //   }
  // };

  // if (loading) return <p>Loading questions...</p>;
  // if (error) return <p>{error}</p>;

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
        {/* {members.map((member, index) => (
          <div key={index} className='member-item'>
            {member}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default MembersSidebar;
