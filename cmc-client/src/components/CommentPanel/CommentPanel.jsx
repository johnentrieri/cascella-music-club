import { useState } from 'react';

import './CommentPanel.css'
import { addArtistComment, addSongComment } from '../../utils/cmc-api';
import Comment from './Comment';

export default function CommentPanel({authHeader,discussionId,comments,onRefreshNeeded,songId}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // User Artist Rating
  const [userComment, setUserComment] = useState('');

  // Sort by date
  comments.sort( (a,b) => b.created_on > a.created_on);

  // Map to comment boxes
  const commentElements = comments.map( (comment) => {
    return(
      <Comment key={comment.id} commentData={comment} />
    );
  });

  // Determine Logged In status
  let isLoggedIn = authHeader !== '' ? true : false;

  async function handleSubmitComment() {
    
    // Clear Error Message
    setErrorMessage('');
    
    // Submit Sogn Comment
    let response = null;
    if (songId) {
      response = await addSongComment(authHeader,discussionId,songId,userComment);
    } else {
      response = await addArtistComment(authHeader,discussionId,userComment);
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
    <div className='comment-panel'>

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <div className='flex-new-line' />

      <h1>Comment Panel</h1>

      <div className='flex-new-line' />

      { isLoggedIn &&
        <div className="comment-input">
          <textarea
            type="text"
            rows={3}
            value={userComment}
            onChange={ (event) => setUserComment(event.target.value)}
          />
          <button onClick={handleSubmitComment}>Submit Comment</button>
        </div>
      }

      <div className='flex-new-line' />
      
      {commentElements}   
      
    </div>
  )
}