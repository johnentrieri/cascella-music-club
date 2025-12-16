import { useState, useEffect } from 'react';

import './AdminPanel.css';
import { generateUserKey, getUserKeys } from '../../utils/cmc-api';

export default function AdminPanel({authHeader}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // Key Data
  const [keyData, setKeyData] = useState(null);

  // Loading State Variables
  const [isRefreshNeeded, setIsRefreshNeeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      // Clear Error Message
      setErrorMessage('');

      // Get Keys
      const response = await getUserKeys(authHeader);

      // Clear Refresh Flag
      setIsRefreshNeeded(false);

      // General Failure
      if (!response) {
        setErrorMessage("Something went wrong");
        return;
    
      } else {

        // Login Fail
        if (response.status === 401) {
          setErrorMessage("Unauthorized");
          return;
        
        // Success
        } else if (response.status === 200) {
          setKeyData(response.data);
          return;
        
        // General Failure
        } else {
          setErrorMessage("Something went wrong");
          return;
        }
      }
    }

    fetchData();
   
  }, [isRefreshNeeded, authHeader]);

  async function handleGenerateKey() {
    // Clear Error Message
    setErrorMessage('');

    // Get Keys
    const response = await generateUserKey(authHeader);

    // General Failure
    if (!response) {
      setErrorMessage("Something went wrong");
      return;
  
    } else {

      // Login Fail
      if (response.status === 401) {
        setErrorMessage("Unauthorized");
        return;
      
      // Success
      } else if (response.status === 200) {
        setIsRefreshNeeded(true);
        return;
        
      
      // General Failure
      } else {
        setErrorMessage("Something went wrong");
        return;
      }
    }
  }

  let keyRows = null;
  if (keyData) {
    keyRows = keyData.map( (entry) => {
      return(
        <tr>
          <td>{entry.userkey}</td>
          <td>{entry.is_claimed ? "Yes" : "No"}</td>
          <td className='hide-on-mobile'>{entry.claimed_by}</td>
        </tr>
      )
    })
  }

  return (
    <div id="admin-panel">
      
      <h1>Admin Panel</h1>      
      <div className='flex-new-line' />

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <div className='flex-new-line' />
      <button onClick={() => setIsRefreshNeeded(true)}>Refresh Keys</button>       
      <div className='flex-new-line' />

      { keyData ?
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Claimed</th>
              <th className='hide-on-mobile'>Claimer</th>
            </tr>
          </thead>
          <tbody>
            {keyRows}
          </tbody>
        </table>

        :

        <>
          <p>No Keys Found</p>
          <div className='flex-new-line' />
        </>

      }

      <div className='flex-new-line' />
      <button onClick={handleGenerateKey}>Generate Key</button>    
      <div className='flex-new-line' />

    </div>
  )
}