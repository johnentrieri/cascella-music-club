import { useState } from 'react'
import NavBar from './components/NavBar/NavBar'

import './App.css'
import AccountPage from './components/AccountPage/AccountPage';

function App() {

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function handleLoginSuccess(authHeader,userData) {
    setAuthHeader(authHeader);
    setUserData(userData);
  }

  function handleLogout() {
    setAuthHeader('');
    setUserData(null);
  }

  const [currentPage, setCurrentPage] = useState('this-week')
  const [authHeader, setAuthHeader] = useState('');
  const [userData, setUserData] = useState(null);

  return (
    <>
      { currentPage === 'account' ? 
        <AccountPage 
          onPageChange={handlePageChange} 
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          userData={userData} 
          authHeader={authHeader}
        />
        :      
        <NavBar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
          userData={userData}  
        />
      }
    </>
  )
}

export default App
