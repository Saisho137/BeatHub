'use client'
import Link from 'next/link'

const Navbar = ({ authEndpoint, clientId, redirectUri, responseType, scope }) => {
    let token = null;
    let isLoggedIn = false;

    if (typeof window !== 'undefined') {
        token = window.sessionStorage.getItem('token');
        isLoggedIn = !!token;
    }
  
    return (
      <div className='container-fluid p-0'>
        <nav className='navbar navbar-expand-md navbar-dark bg-dark border-3 border-bottom border-success'>
          <div className='container-fluid'>
            <Link href="/" className='navbar-brand'>BeatHub</Link>
            <button type='button' className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#navMenu">
              <span className='navbar-toggler-icon'></span>
            </button>
            <div id='navMenu' className='collapse navbar-collapse'>
              <ul className='navbar-nav ms-3'>
                <li className='nav-item'><Link className='nav-link' href="/recommender">Recommender</Link></li>
                <li className='nav-item'><Link className='nav-link' href="/game">Game</Link></li>
                <li className='nav-item'><Link className='nav-link' href="/statistics">Statistics</Link></li>
              </ul>
              {isLoggedIn ? (
                <div className='bg-success p-3 rounded-5 d-flex ms-auto'>
                    <img src="image-url" alt="User Image" className="user-avatar" />
                    <span className="nav-item nav-link text-light">User Name</span>
                </div>
              ) : (
                <div className='bg-success p-3 rounded-5 ms-auto'>
                  <Link
                    className="nav-item nav-link text-light"
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`}
                  >
                    Login With Spotify
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    );
  };

export default Navbar