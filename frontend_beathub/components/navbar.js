'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const urlParams = new URLSearchParams(hash.replace('#', '?'));
      const token = urlParams.get('access_token');

      window.location.hash = '';
      sessionStorage.setItem('token', token);
    }

    const fetchData = async (token) => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get('http://localhost:8080/getUserData', { headers });
        let { username, image } = response.data;
        if(image == null){
          image = "/images/person-circle.svg"
        }
        const user = { username, image };
        setUserData(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };

    const token = sessionStorage.getItem('token');
    if (token) {
      fetchData(token);
    }
  }, []);

  const handleLogin = () => {
    const CLIENT_ID = '39dd8906e8044b7eb1715c1a4a1867e7';
    const REDIRECT_URI = "http://localhost:3000";
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'user-read-private playlist-read-private user-read-currently-playing user-follow-read user-top-read';

    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = url;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className='container-fluid p-0'>
      <nav className='navbar navbar-expand-md navbar-dark bg-dark border-3 border-bottom border-success'>
        <div className='container-fluid'>
          <Link href="/" className='navbar-brand fs-4'>BeatHub</Link>
          <button type='button' className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className='navbar-toggler-icon'></span>
          </button>
          <div id='navMenu' className='collapse navbar-collapse'>
          <ul className='navbar-nav ms-3'>
            {isLoggedIn && (
              <>
                <li className='nav-item'><Link className='nav-link' href="/recommender">Recommender</Link></li>
                <li className='nav-item'><Link className='nav-link' href="/game">Game</Link></li>
                <li className='nav-item'><Link className='nav-link' href="/statistics">Statistics</Link></li>
              </>
            )}
            <li className='nav-item'>
              {userData?.image && isLoggedIn && userData?.username && (<img src={userData.image} alt="User Image" className="rounded-circle user-avatar mt-3 d-md-none ms-2" style={{ width: '60px', height: '60px' }} />)}
              {userData?.image && isLoggedIn && userData?.username && (<span className="pt-3 p-2 px-0 nav-item nav-link text-light fs-5 fw-bold d-md-none">{userData.username}</span>)}
              {isLoggedIn && (
                <button className='nav-link text-success fw-semibold d-md-none' onClick={handleLogout}>Logout</button>
              )}
            </li>
          </ul>
            {isLoggedIn ? (
              <div className='p-3 d-flex ms-auto container justify-content-end'>
                <div className='row justify-content-endt' style={{ marginTop: '-2rem', marginBottom: '-0.2rem' }}>
                  <div className='col-6'>
                    {userData?.image && <img src={userData.image} alt="User Image" className="rounded-circle user-avatar mt-3 d-none d-md-block" style={{ width: '60px', height: '60px' }} />}
                  </div>
                  <div className='col-6 px-0'>
                    {userData?.username && <span className="pt-3 p-2 px-0 nav-item nav-link text-light fs-5 fw-bold d-none d-md-block">{userData.username}</span>}
                    <button className='nav-link text-success fw-semibold d-none d-md-inline d-none d-md-block' onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-success p-3 rounded-5 ms-auto btn btn-sm' style={{margin: '0.6rem'}}>
                <button className="nav-item nav-link text-light fw-semibold" onClick={handleLogin}>Login with Spotify</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;