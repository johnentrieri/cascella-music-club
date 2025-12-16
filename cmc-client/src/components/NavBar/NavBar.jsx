import './NavBar.css';

export default function NavBar({currentPage,onPageChange,userData}) {

  let isLoggedIn = userData ? true : false;

  return (    
    <div id="header">

      <div id="account-btn-container">
        <button onClick={() => onPageChange('account')}>
          <i className="lni lni-lg lni-user-4"></i>
          <span>{isLoggedIn ? userData.username : "Login"}</span>
        </button>
      </div>

      <h1>Cascella Music Club</h1>

      <nav id="navbar">
        <ul>
          <li>
            <a 
              className={ currentPage === 'this-week' ? "active" : null}
              href="#"
              onClick={() => onPageChange('this-week')}>
              <span>This Week</span>
            </a>
          </li>
          <li>
            <a 
              className={ currentPage === 'prev-week' ? "active" : null}
              href="#"
              onClick={() => onPageChange('prev-week')}>
              <span>Previous Weeks</span>
            </a>
          </li>
          <li>
            <a 
              className={ currentPage === 'statistics' ? "active" : null}
              href="#"
              onClick={() => onPageChange('statistics')}>
              <span>Statistics</span>
            </a>
          </li>
          <li>
            <a 
              className={ currentPage === 'about-us' ? "active" : null}
              href="#"
              onClick={() => onPageChange('about-us')}>
              <span>About Us</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}