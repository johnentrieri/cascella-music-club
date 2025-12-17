import axios from "axios";

const API_URL = 'http://localhost:4000';

// Login User
export async function loginUser(authHeader) {
  const response = await axios.get(`${API_URL}/user/login`, {
    headers:{'Authorization': authHeader},
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })
  
  return(response)
}

// Register User
export async function registerUser(userkey, username, email, password) {
  const response = await axios.post(`${API_URL}/user`, 
    {
      userkey : userkey,
      username : username,
      email : email,
      password : password
    },
    {
      headers:{ 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })
  
  return(response)
}

// Get User Keys
export async function getUserKeys(authHeader) {
  const response = await axios.get(`${API_URL}/userkey`, {
    headers:{'Authorization': authHeader},
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Generate User Keys
export async function generateUserKey(authHeader) {
  const response = await axios.post(`${API_URL}/userkey`, {}, {
    headers:{'Authorization': authHeader},
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Get Users
export async function getUsers() {
  const response = await axios.get(`${API_URL}/user`, {
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Create Discussion
export async function createDiscussion(authHeader,discussionData) {
  const response = await axios.post(`${API_URL}/discussion`, 
    discussionData,
    {
      headers:{
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })
  
  return(response)
}

// Get Discussions
export async function getDiscussions() {
  const response = await axios.get(`${API_URL}/discussion`, {
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Get Discussion By Id
export async function getDiscussionById(discussionId) {
  const response = await axios.get(`${API_URL}/discussion/${discussionId}`, {
    validateStatus: (status) => { return status < 500; }
  })
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Rate Artist
export async function rateArtist(authHeader, discussionId, rating) {
  const response = await axios.post(`${API_URL}/discussion/${discussionId}/rate`,
    {rating : rating},
    {
      headers:{
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Add Artist Comment
export async function addArtistComment(authHeader, discussionId, comment) {
  const response = await axios.post(`${API_URL}/discussion/${discussionId}/comment`,
    {comment : comment},
    {
      headers:{
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Rate Song
export async function rateSong(authHeader, discussionId, songId, rating) {
  const response = await axios.post(`${API_URL}/discussion/${discussionId}/${songId}/rate`,
    {rating : rating},
    {
      headers:{
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}

// Add Song Comment
export async function addSongComment(authHeader, discussionId, songId, comment) {
  const response = await axios.post(`${API_URL}/discussion/${discussionId}/${songId}/comment`,
    {comment : comment},
    {
      headers:{
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: (status) => { return status < 500; }
    }
  )
  .catch( (error) => {
    console.log("An Error Has Occurred:", error.message)
  })

  return(response)
}
