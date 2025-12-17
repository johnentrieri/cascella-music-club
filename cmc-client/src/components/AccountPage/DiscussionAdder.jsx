import { useState, useEffect } from 'react';

import './DiscussionAdder.css';
import { createDiscussion, getUsers } from '../../utils/cmc-api';
import { getToday, getWeekEnd } from '../../utils/utils';

export default function DiscussionAdder({authHeader}) {

  // Error Message
  const [errorMessage, setErrorMessage] = useState('');

  // User List
  const [userList, setUserList] = useState([]);

  // Discussion Inputs
  const [startDate,setStartDate] = useState(getToday());
  const [endDate,setEndDate] = useState(getWeekEnd());
  const [artist,setArtist] = useState('');
  const [genre,setGenre] = useState('');
  const [curator,setCurator] = useState('');
  const [popSong1,setPopSong1] = useState('');
  const [popSong2,setPopSong2] = useState('');
  const [popSong3,setPopSong3] = useState('');
  const [favSong1,setFavSong1] = useState('');
  const [favSong2,setFavSong2] = useState('');
  const [favSong3,setFavSong3] = useState('');
  const [uniSong1,setUniSong1] = useState('');
  const [uniSong2,setUniSong2] = useState('');
  const [uniSong3,setUniSong3] = useState('');

  // Loading State Variables
  const [isRefreshNeeded, setIsRefreshNeeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      // Clear Error Message
      setErrorMessage('');

      // Get Keys
      const response = await getUsers();

      // Clear Refresh Flag
      setIsRefreshNeeded(false);

      // General Failure
      if (!response) {
        setErrorMessage("Something went wrong");
        return;
    
      } else {

        // Success
        } if (response.status === 200) {
          setUserList(response.data);
          return;
        
        // General Failure
        } else {
          setErrorMessage("Something went wrong");
          return;
        }
      }

    fetchData();
    
  }, [isRefreshNeeded]);

  async function handleDiscussionCreate() {
    
    // Clear Error Message
    setErrorMessage('');

    if (startDate === '' || endDate === '') {
      setErrorMessage('Invalid Date Range');
      return;
    }

    if (artist === '') {
      setErrorMessage('Artist Name Required');
      return;
    }

    if (curator === '') {
      setErrorMessage('Curator Required');
      return;
    }

    if (popSong1 === '' || popSong2 === '' || popSong3 === '') {
      setErrorMessage('Invalid Popular Songs');
      return;
    }

    if (favSong1 === '' || favSong2 === '' || favSong3 === '') {
      setErrorMessage('Invalid Favorite Songs');
      return;
    }

    if (uniSong1 === '' || uniSong2 === '' || uniSong3 === '') {
      setErrorMessage('Invalid Unique Songs');
      return;
    }

    const discussionObject = {
      start_date : startDate,
      end_date : endDate,
      curator : curator,
      artist : {
        name : artist,
        genre : genre,
        img_url: "",
        comments: [],
        ratings: [],
      },
      songs : [
        {
          name: popSong1,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: popSong2,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: popSong3,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: favSong1,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: favSong2,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: favSong3,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: uniSong1,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: uniSong2,
          album : "",
          comments : [],
          ratings : []
        },
        {
          name: uniSong3,
          album : "",
          comments : [],
          ratings : []
        },
      ]
    }

    // Create Discussion
    const response = await createDiscussion(authHeader,discussionObject);

    // General Failure
    if (!response) {
      setErrorMessage("Something went wrong");
      return;
  
    } else {

      // Login Fail
      if (response.status === 401) {
        setErrorMessage("Unauthorized");
        return;

      // Curator Not Found Fail
      } else if (response.status === 400) {
        setErrorMessage("Curator Not Found");
        return;
      
      // Success
      } else if (response.status === 200) {
        console.log(response);
        return;
        
      
      // General Failure
      } else {
        setErrorMessage("Something went wrong");
        return;
      }
    }
  }

  // User Dropdown List
  const userDropdown = userList.map( (user) => {
    if (user.id === -1) return null;
    return(
      <option key={user.id} value={user.username}>{user.username}</option>
    )
  })

  // Add Empty Option
  userDropdown.unshift(<option key='0' value=''></option>)

  return (
    <div id="discussion-adder">
      
      <h1>Create Discussion</h1>

      <div className='flex-new-line' />

      {errorMessage === '' ? null :
        <div className='error-msg'>
          <p>{errorMessage}</p>
        </div>
      }

      <div className='flex-new-line' />

      <label>Date Range: </label>

      <div className='flex-new-line' />

      <input
        type='date'
        placeholder='Start Date'
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
      />

      <input
        type='date'
        placeholder='End Date'
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
      />

      <div className='flex-new-line' />

      <label>Artist Info: </label>

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Artist'
        value={artist}
        onChange={(event) => setArtist(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Genre'
        value={genre}
        onChange={(event) => setGenre(event.target.value)}
      />

      <div className='flex-new-line' />

      <label>Curated By: </label>

      <div className='flex-new-line' />

      <select value={curator} onChange={(event) => setCurator(event.target.value)}>
        {userDropdown}
      </select>

      <div className='flex-new-line' />

      <label>Most Famous Songs: </label>

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Popular Song #1'
        value={popSong1}
        onChange={(event) => setPopSong1(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Popular Song #2'
        value={popSong2}
        onChange={(event) => setPopSong2(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Popular Song #3'
        value={popSong3}
        onChange={(event) => setPopSong3(event.target.value)}
      />

      <div className='flex-new-line' />

      <label>Curator's Favorites: </label>

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Favorite Song #1'
        value={favSong1}
        onChange={(event) => setFavSong1(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Favorite Song #2'
        value={favSong2}
        onChange={(event) => setFavSong2(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Favorite Song #3'
        value={favSong3}
        onChange={(event) => setFavSong3(event.target.value)}
      />

      <div className='flex-new-line' />

      <label>Unique Songs: </label>

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Unique Song #1'
        value={uniSong1}
        onChange={(event) => setUniSong1(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Unique Song #2'
        value={uniSong2}
        onChange={(event) => setUniSong2(event.target.value)}
      />

      <div className='flex-new-line' />

      <input
        type='text'
        placeholder='Unique Song #3'
        value={uniSong3}
        onChange={(event) => setUniSong3(event.target.value)}
      />

      <div className='flex-new-line' />

      <button onClick={handleDiscussionCreate}>Create Discussion</button>

    </div>
  )
}