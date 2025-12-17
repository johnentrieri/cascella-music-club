import { useState } from 'react'
import NavBar from './components/NavBar/NavBar'

import './App.css'
import AccountPage from './components/AccountPage/AccountPage';
import CurrentWeekPage from './components/CurrentWeekPage/CurrentWeekPage';
import PreviousWeeksPage from './components/PreviousWeeksPage/PreviousWeeksPage';

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

  let content = null;
  if (currentPage === 'this-week') {
    content = <CurrentWeekPage authHeader={authHeader}/>
  } else if (currentPage === 'prev-week') {
    content = <PreviousWeeksPage authHeader={authHeader}/>
  }

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
        <>
          <NavBar 
            currentPage={currentPage}
            onPageChange={handlePageChange}
            userData={userData}  
          />
          {content}
        </>
      }
    </>
  )
}

export default App
