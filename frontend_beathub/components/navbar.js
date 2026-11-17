import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { redirectToSpotifyLogin } from '../lib/spotifyAuth'
import NowPlaying from './nowPlaying'
import ThemeToggle from './themeToggle'

const LINKS = [
  { href: '/statistics', label: 'Statistics' },
  { href: '/library', label: 'Library' },
  { href: '/recommender', label: 'Explore' },
]

const Navbar = () => {
  const [userData, setUserData] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const fetchData = async (token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const response = await axios.get('/api/getUserData', { headers })
      const { username, image } = response.data
      setUserData({ username, image: image ?? '/images/person-circle.svg' })
      setIsLoggedIn(true)
    } catch (error) {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      fetchData(token)
    }
  }, [])

  // Expose the header height (it grows with the now playing strip) for sticky elements below it
  const headerRef = useRef(null)
  useEffect(() => {
    const header = headerRef.current
    if (!header || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  const handleLogin = () => {
    sessionStorage.removeItem('callback')
    redirectToSpotifyLogin()
  }

  const handleLogout = (event) => {
    event.preventDefault()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('tokenTimestamp')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header ref={headerRef} className='app-header sticky-top font'>
      <nav className='navbar navbar-expand-md'>
        <div className='container-fluid px-3 px-lg-4'>
          <Link href="/" className='navbar-brand fs-4 me-4'>
            <img src='/favicon.svg' width='32' height='32' alt='' />
            BeatHub
          </Link>
          <button type='button' className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls='navMenu' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div id='navMenu' className='collapse navbar-collapse'>
            <ul className='navbar-nav gap-1 my-2 my-md-0'>
              {isLoggedIn && LINKS.map(({ href, label }) =>
                <li key={href} className='nav-item'>
                  <Link className={`nav-link ${router.pathname === href ? 'active' : ''}`} href={href}>{label}</Link>
                </li>
              )}
            </ul>
            <div className='d-flex align-items-center gap-2 ms-md-auto pb-2 pb-md-0'>
              <ThemeToggle />
              {isLoggedIn ? (
                <div className='dropdown'>
                  <a className='user-menu dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                    <img src={userData.image} alt='' />
                    <span className='text-truncate' style={{ maxWidth: '10rem' }}>{userData.username}</span>
                  </a>
                  <ul className='dropdown-menu dropdown-menu-end'>
                    <li><a className='dropdown-item text-danger fw-semibold' href='#' onClick={handleLogout}>Logout</a></li>
                  </ul>
                </div>
              ) : (
                <button type='button' className='btn main-color' onClick={handleLogin}>Login with Spotify</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isLoggedIn && <NowPlaying />}
    </header>
  )
}
export default Navbar
