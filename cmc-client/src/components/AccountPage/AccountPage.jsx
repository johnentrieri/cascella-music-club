import { useState } from 'react';

import { loginUser, registerUser } from '../../utils/cmc-api';

import './AccountPage.css';
import AdminPanel from './AdminPanel';

export default function AccountPage({onPageChange, onLoginSuccess, onLogout, userData, authHeader}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // Login Credentials
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Credentials
  const [regKey, setRegKey] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConf, setRegPasswordConf] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Determine Login Status
  let isLoggedIn = false;
  if (authHeader !== '' && userData !== null) {
    isLoggedIn = true;
  }

  // On Login Click
  async function handleLoginAttempt() {

    // Clear Error Message
    setErrorMessage('');

    // Establish Authorization Header
    const credentials = `${loginUsername}:${loginPassword}`;
    const encodedCredentials = btoa(credentials);
    const authHeaderString = `Basic ${encodedCredentials}`

    // Attempt Login
    const response = await loginUser(authHeaderString);

    // General Failure
    if (!response) {
      setErrorMessage("Something went wrong");
      return;
  
    } else {

      // Login Fail
      if (response.status === 401) {
        setErrorMessage("Login Failed");
        return;
      
      // Success
      } else if (response.status === 200) {
        onLoginSuccess(authHeaderString,response.data);
        return;
      
      // General Failure
      } else {
        setErrorMessage("Something went wrong");
        return;
      }
    }
  }

  // On Login Click
  async function handleRegisterAttempt() {

    // Clear Error Message
    setErrorMessage('');

    if (regKey === '') {
      setErrorMessage('Registration Key Required');
      return;
    }

    if (regEmail === '') {
      setErrorMessage('Email Required');
      return;
    }

    if (regUsername === '') {
      setErrorMessage('Username Required');
      return;
    }    

    if (regPassword.length < 4 ) {
      setErrorMessage('Password Too Short');
      return;
    }

    if (regPassword !== regPasswordConf) {
      setErrorMessage('Passwords Do Not Match');
      return;
    }

    // Attempt Registration
    const response = await registerUser(regKey,regUsername,regEmail,regPassword);

    // General Failure
    if (!response) {
      setErrorMessage("Something went wrong");
      return;
  
    } else {

      // Registration Key Invalid
      if (response.status === 400) {
        setErrorMessage("Key Invalid");
        return;
      
      // Success
      } else if (response.status === 200) {

        // Establish Authorization Header
        const credentials = `${regUsername}:${regPassword}`;
        const encodedCredentials = btoa(credentials);
        const authHeaderString = `Basic ${encodedCredentials}`
        
        // Attempt Login
        const response = await loginUser(authHeaderString);

        // General Failure
        if (!response) {
          setErrorMessage("Something went wrong");
          return;
      
        } else {

          // Login Fail
          if (response.status === 401) {
            setErrorMessage("Login Failed");
            return;
          
          // Success
          } else if (response.status === 200) {
            onLoginSuccess(authHeaderString,response.data);
            return;
          
          // General Failure
          } else {
            setErrorMessage("Something went wrong");
            return;
          }
        }
      
      // General Failure
      } else {
        setErrorMessage("Something went wrong");
        return;
      }
    }
  }

  return (
    <div id="account">

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <button id="cancel-btn" onClick={ ()=>onPageChange('this-week') }>
        Return
      </button>
      
      { isLoggedIn ?

        <div id="profile">
          <h1>Account Info</h1>
          <div className='flex-new-line' />
          <p>ID: {userData.id}</p>
          <div className='flex-new-line' />
          <p>Username: {userData.username}</p>
          <div className='flex-new-line' />
          <p>Join Date: {userData.join_date}</p>
          <div className='flex-new-line' />
          <p>Admin: {userData.is_admin ? "Yes" : "No"}</p>
          <div className='flex-new-line' />          

          { userData.is_admin ?
            <AdminPanel authHeader={authHeader}/>
            : null
          }

          <div className='flex-new-line' />
          <button onClick={onLogout}>Logout</button>
        </div>

        :

        <div id="login-form">

          <h1>Login</h1>

          <div className='flex-new-line' />

          <input
            type='text'
            placeholder='Username'
            value={loginUsername}
            onChange={(event) => setLoginUsername(event.target.value)}
          />

          <div className='flex-new-line' />

          <input
            type='password'
            placeholder='Password'
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
          />

          <div className='flex-new-line' />

          <button onClick={handleLoginAttempt}>Login</button>

          <div className='flex-new-line' />

          <p>-OR-</p>

          <div className='flex-new-line' />

          <h1>Register</h1>

          <div className='flex-new-line' />

          <input
            type='text'
            placeholder='Registration Key'
            value={regKey}
            onChange={(event) => setRegKey(event.target.value)}
          />

          <div className='flex-new-line' />

          <input
            type='text'
            placeholder='Email'
            value={regEmail}
            onChange={(event) => setRegEmail(event.target.value)}
          />          

          <div className='flex-new-line' />

          <input
            type='text'
            placeholder='Username'
            value={regUsername}
            onChange={(event) => setRegUsername(event.target.value)}
          />         

          <div className='flex-new-line' />

          <input
            type='password'
            placeholder='Password'
            value={regPassword}
            onChange={(event) => setRegPassword(event.target.value)}
          />    

          <div className='flex-new-line' />

          <input
            type='password'
            placeholder='Confirm Password'
            value={regPasswordConf}
            onChange={(event) => setRegPasswordConf(event.target.value)}
          />    

          <div className='flex-new-line' />

          <button onClick={handleRegisterAttempt}>Register</button>

        </div>        
      }
      
    </div>
  )
}