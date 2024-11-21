import React, { useEffect, useState } from 'react';
import { getCommunityByName } from '../../../../../services/communityService';

const MembersSidebar = ({ communityName }: { communityName: string }) => {
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const community = await getCommunityByName(communityName);
        setMembers(community.users || []);
      } catch (error) {
        console.error('Failed to fetch community members:', error);
      }
    };

    fetchMembers();
  }, [communityName]);

  return (
    <div className='members-sidebar'>
      <h3>Community Members</h3>
      <ul>
        {members.map(member => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default MembersSidebar;
