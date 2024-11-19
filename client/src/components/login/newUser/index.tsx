import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useCreateUser from '../../../hooks/useCreateUser';
import logo from '../../../logo.svg';

const CreateUser = () => {
  const navigate = useNavigate();
  const handleUserTypeSelection = () => {
    navigate('/');
  };

  const {
    email,
    password,
    firstName,
    lastName,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleSubmit,
  } = useCreateUser();

  return (
    <div className='container'>
      <img src={logo} alt='code quest logo' className='logo-login' />
      <h2>Lets get you set up!</h2>
      <h4>Please enter your name, desired email, and password.</h4>
      {isLoading && <p>Creating account...</p>}
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={firstName}
          onChange={handleFirstNameChange}
          placeholder='Enter your first name'
          required
          className='input-text'
          id='firstNameInput'
        />
        <input
          type='text'
          value={lastName}
          onChange={handleLastNameChange}
          placeholder='Enter your last name'
          required
          className='input-text'
          id='lastNameInput'
        />
        <input
          type='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email'
          required
          className='input-text'
          id='emailInput'
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id='passwordInput'
        />
        <div className='button-group'>
          <button type='submit' className='login-button'>
            Create Account
          </button>
          <button type='button' className='back-button' onClick={handleUserTypeSelection}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
