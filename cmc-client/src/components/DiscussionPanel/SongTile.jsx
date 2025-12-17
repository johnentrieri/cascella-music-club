import { useState } from 'react'

import './SongTile.css'

import RatingPanel from '../RatingPanel/RatingPanel';
import CommentPanel from '../CommentPanel/CommentPanel';

export default function SongTile({authHeader, songData, onRefreshNeeded}) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [showRatingPanel, setShowRatingPanel] = useState(false);
  const [showCommentPanel, setShowCommentPanel] = useState(false);

  return(
    <div className="song-tile">
      <div className="song-tile-header">
        <p>{songData.name}</p>
        <button onClick={ ()=> setIsExpanded(!isExpanded)}>
          { isExpanded ? "Collapse" : "Expand" }
        </button>
      </div>

      { isExpanded &&
        <>
          <div className='flex-new-line' />
          
          <button onClick={()=> setShowRatingPanel(!showRatingPanel)}>
            { showRatingPanel ? "Hide Song Ratings" : "Show Song Ratings" }
          </button>

          <div className='flex-new-line' />

          { showRatingPanel &&
            <RatingPanel
              authHeader={authHeader}
              discussionId={songData.discussion_id}           
              ratings={songData.ratings}
              onRefreshNeeded={onRefreshNeeded}
              songId={songData.id}
            />
          }

          <div className='flex-new-line' />

          <button onClick={()=> setShowCommentPanel(!showCommentPanel)}>
            { showCommentPanel ? "Hide Song Comments" : "Show Song Comments" }
          </button>

          <div className='flex-new-line' />

          { showCommentPanel &&
            <CommentPanel
              authHeader={authHeader}
              discussionId={songData.discussion_id} 
              comments={songData.comments}
              onRefreshNeeded={onRefreshNeeded}
              songId={songData.id}
            />
          }

          <div className='flex-new-line' />
        </>
      }
    </div>
  )
}