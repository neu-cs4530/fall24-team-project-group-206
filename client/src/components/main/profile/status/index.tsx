import React from 'react';
import './index.css';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * StatusInfo component which displays the user's status.
 */
const StatusInfo = () => {
  const { user } = useUserContext();
  return (
    <div className='status-info'>
      <p>{user.status}</p>
    </div>
  );
};

export default StatusInfo;
