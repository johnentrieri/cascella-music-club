import { useState, useEffect } from 'react'

import './PreviousWeeksPage.css'
import { getDiscussions } from '../../utils/cmc-api';
import { isActiveDiscussion } from '../../utils/utils';
import DiscussionPanel from '../DiscussionPanel/DiscussionPanel';

export default function PreviousWeeksPage({authHeader}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // Discussions
  const [selectedDiscussionId, setSelectedDiscussionId] = useState('')
  const [discussionList, setDiscussionList] = useState([]);

  // Loading State Variables
  const [isRefreshNeeded, setIsRefreshNeeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      // Clear Error Message
      setErrorMessage('');

      // Clear Refresh Flag
      setIsRefreshNeeded(false);
      
      // Get Discussions
      const response = await getDiscussions();

      // General Failure
      if (!response) {
        setErrorMessage("Something went wrong");
        return;
    
      } else {

        // Success
        } if (response.status === 200) {
          setDiscussionList(response.data);
          return;
        
        // General Failure
        } else {
          setErrorMessage("Something went wrong");
          return;
        }
      }

    fetchData();
    
  }, [isRefreshNeeded]);

  const pastDiscussions = [];
  for (const discussion of discussionList) {
    if (!isActiveDiscussion(discussion)) {    
      pastDiscussions.push(discussion);
    }
  }

  // User Dropdown List
  const pastDiscussionDropdown = pastDiscussions.map( (disc) => {
    if (disc.id === -1) return null;
    const descString = `${disc.start_date}: ${disc.artist}`;
    return(      
      <option key={disc.id} value={disc.id}>{descString}</option>
    )
  })

  // Add Empty Option
  pastDiscussionDropdown.unshift(<option key='0' value=''>Select a Discussion</option>)

  return (
    <div id="prev-week">

      <h1>Active Discussions</h1>

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <select value={selectedDiscussionId} onChange={(event) => setSelectedDiscussionId(event.target.value)}>
        {pastDiscussionDropdown}
      </select>

      { selectedDiscussionId !== '' &&
        <DiscussionPanel 
          authHeader={authHeader}
          discussionId={selectedDiscussionId}
        />
      }

    </div>
  )
}
