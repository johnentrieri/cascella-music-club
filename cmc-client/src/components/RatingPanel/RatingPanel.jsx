import { useState } from 'react';

import './RatingPanel.css'
import { rateArtist, rateSong } from '../../utils/cmc-api';

export default function RatingPanel({authHeader,discussionId,ratings,onRefreshNeeded,songId}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // User Artist Rating
  const [userRating, setUserRating] = useState(5);

  const ratingRows = ratings.map( (rating) => {
    return(
      <tr>
        <td>{rating.author}</td>
        <td>{rating.rating}</td>
      </tr>
    );
  });

  let isLoggedIn = authHeader !== '' ? true : false;

  async function handleSubmitRating() {
    // Clear Error Message
    setErrorMessage('');
    
    // Submit Rating
    let response = null;
    if (songId) {
      response = await rateSong(authHeader,discussionId,songId,userRating);
    } else {
      response = await rateArtist(authHeader,discussionId,userRating);
    }

    // General Failure
    if (!response) {
      setErrorMessage("Something went wrong");
      return;
  
    } else {

      // Success
      } if (response.status === 200) {
        onRefreshNeeded();
        return;
      
      // General Failure
      } else {
        setErrorMessage("Something went wrong");
        return;
      }
    }

  return(
    <div className='rating-panel'>

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <div className='flex-new-line' />

      <h1>Rating Panel</h1>

      <div className='flex-new-line' />

      <table className="rating-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratingRows}
        </tbody>
      </table>

      <div className='flex-new-line' />

      { isLoggedIn &&
        <div className="rating-input">
          <input
            type="range"
            min="1"
            max="10"
            value={userRating}
            onChange={ (event) => setUserRating(event.target.value)}
          />
          <label>{userRating}</label>
          <button onClick={handleSubmitRating}>Submit Rating</button>
        </div>
      }
      
    </div>
  )
}