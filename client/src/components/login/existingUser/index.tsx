import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const navigate = useNavigate();
  const handleUserTypeSelection = () => {
    navigate('/');
  };

  const { email, password, errorMessage, handleEmailChange, handlePasswordChange, handleSubmit } =
    useLogin();

  return (
    <div className='container'>
      <h2>Welcome back!</h2>
      <h4>Please enter your email and password.</h4>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}{' '}
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email'
          required
          className='input-text'
          id={'emailInput'}
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        <button type='submit' className='login-button'>
          Submit
        </button>
        <button type='button' className='back-button' onClick={handleUserTypeSelection}>
          Back
        </button>
      </form>
    </div>
  );
};

export default Login;
