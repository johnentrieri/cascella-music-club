import { useState, useEffect } from 'react'

import './CurrentWeekPage.css'
import { getDiscussions } from '../../utils/cmc-api';
import { isActiveDiscussion } from '../../utils/utils';
import DiscussionPanel from '../DiscussionPanel/DiscussionPanel';

export default function CurrentWeekPage({authHeader}) {

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

  const activeDiscussions = [];
  for (const discussion of discussionList) {
    if (isActiveDiscussion(discussion)) {    
      activeDiscussions.push(discussion);
    }
  }

  // User Dropdown List
  const activeDiscussionDropdown = activeDiscussions.map( (disc) => {
    if (disc.id === -1) return null;
    const descString = `${disc.start_date}: ${disc.artist}`;
    return(      
      <option key={disc.id} value={disc.id}>{descString}</option>
    )
  })

  // Add Empty Option
  activeDiscussionDropdown.unshift(<option key='0' value=''>Select a Discussion</option>)

  return (
    <div id="current-week">

      <h1>Active Discussions</h1>

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <select value={selectedDiscussionId} onChange={(event) => setSelectedDiscussionId(event.target.value)}>
        {activeDiscussionDropdown}
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
