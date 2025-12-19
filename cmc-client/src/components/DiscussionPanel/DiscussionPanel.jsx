import { useState, useEffect } from 'react'

import './DiscussionPanel.css'
import { getDiscussionById } from '../../utils/cmc-api';

import CommentPanel from '../CommentPanel/CommentPanel';
import RatingPanel from '../RatingPanel/RatingPanel';
import SongTile from './SongTile';

export default function DiscussionPanel({authHeader, discussionId}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // Discussion Content
  const [discussionData, setDiscussionData] = useState(null);
  const [showRatingPanel, setShowRatingPanel] = useState(false);
  const [showCommentPanel, setShowCommentPanel] = useState(false);

  // Loading State Variables
  const [isRefreshNeeded, setIsRefreshNeeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      // Clear Error Message
      setErrorMessage('');

      // Clear Refresh Flag
      setIsRefreshNeeded(false);
      
      // Get Discussion By Id
      const response = await getDiscussionById(discussionId);

      // General Failure
      if (!response) {
        setErrorMessage("Something went wrong");
        return;
    
      } else {

        // Success
        } if (response.status === 200) {
          setDiscussionData(response.data);
          return;
        
        // General Failure
        } else {
          setErrorMessage("Something went wrong");
          return;
        }
      }

    fetchData();
    
  }, [isRefreshNeeded, discussionId]);

  function refreshDiscussionData() {
    setIsRefreshNeeded(true);
  }

  let songTiles = null;
  if (discussionData) {
    songTiles = discussionData.songs.map( (song) => {
      return(
        <SongTile key={song.id}
          authHeader={authHeader}
          songData={song}
          onRefreshNeeded={refreshDiscussionData}
        />
      )
    })
  }

  return (
    <div id="discussion-panel">
      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }
      
      { discussionData &&

        <div className="discussion-card">

          <h1>{discussionData.artist.name}</h1>

          <div className='flex-new-line' />

          <img className="artist-img" src={discussionData.artist.img_url} />

          <div className='flex-new-line' />

          <p>Curated By: {discussionData.curator}</p>

          <button onClick={()=> setShowRatingPanel(!showRatingPanel)}>
            { showRatingPanel ? "Hide Artist Ratings" : "Show Artist Ratings" }
          </button>

          <div className='flex-new-line' />

          { showRatingPanel &&
            <RatingPanel
              authHeader={authHeader}
              discussionId={discussionData.id}           
              ratings={discussionData.artist.ratings}
              onRefreshNeeded={refreshDiscussionData}
            />
          }

          <div className='flex-new-line' />

          <button onClick={()=> setShowCommentPanel(!showCommentPanel)}>
            { showCommentPanel ? "Hide Artist Comments" : "Show Artist Comments" }
          </button>

          <div className='flex-new-line' />

          { showCommentPanel &&
            <CommentPanel
              authHeader={authHeader}
              discussionId={discussionData.id} 
              comments={discussionData.artist.comments}
              onRefreshNeeded={refreshDiscussionData} 
            />
          }

          <div className='flex-new-line' />

          {songTiles}

        </div>
      }
    </div>
  )
}
