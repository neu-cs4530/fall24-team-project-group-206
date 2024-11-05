import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useCreateUser from '../../../hooks/useCreateUser';

/**
 * Create User Component contains a form that allows the user to input their username and password
 * and create an account with the application.
 */
const CreateUser = () => {
  const navigate = useNavigate();
  const handleUserTypeSelection = () => {
    navigate('/');
  };
  const {
    email,
    password,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useCreateUser();

  return (
    <div className='container'>
      <h2>Thanks for using our program!</h2>
      <h4>Please enter your desired email and password.</h4>
      {isLoading && <p>Creating account...</p>}
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
          Create Account
        </button>
        <button type='button' className='back-button' onClick={handleUserTypeSelection}>
          Back
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
