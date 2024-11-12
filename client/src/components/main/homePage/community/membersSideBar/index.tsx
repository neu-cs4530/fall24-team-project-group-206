import React from 'react';
import './index.css';

const MembersSidebar = () => {
  // placeholder for now:
  const members = [
    'Member 1',
    'Member 2',
    'Member 3',
    'Member 4',
    'Member 5',
    'Member 6',
    'Member 7',
    'Member 8',
    'Member 9',
    'Member 10',
    'Member 11',
    'Member 12',
  ];

  return (
    <div className='members-sidebar'>
      <div className='members-title'>
        <div>MEMBERS:</div>
        <hr className='title-line' />
      </div>
      <div className='members-list'>
        {members.map((member, index) => (
          <div key={index} className='member-item'>
            {member}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersSidebar;
