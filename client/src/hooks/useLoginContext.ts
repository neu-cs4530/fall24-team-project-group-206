import { useContext } from 'react';
import LoginContext from '../contexts/LoginContext';
import { LoginContextType } from '../contexts/LoginContext';

const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('useLoginContext must be used within a LoginContext.Provider');
  }

  return context;
};

export default useLoginContext;
