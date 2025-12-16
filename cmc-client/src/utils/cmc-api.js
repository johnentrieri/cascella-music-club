import axios from "axios";

const API_URL = 'http://localhost:4000';

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


