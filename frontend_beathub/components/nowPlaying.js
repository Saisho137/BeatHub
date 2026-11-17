import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const REFRESH_MS = 30000

// Navbar item with the song currently playing on the user's Spotify
export default function NowPlaying() {
    const [nowPlaying, setNowPlaying] = useState(null)

    useEffect(() => {
        const refresh = async () => {
            if (document.hidden) return
            try {
                const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
                const { data } = await axios.get('/api/nowPlaying', headers)
                setNowPlaying(data.track ? data : null)
            } catch {
                // Not critical: just hide it (expired sessions are handled by each page)
                setNowPlaying(null)
            }
        }

        refresh()
        const interval = setInterval(refresh, REFRESH_MS)
        document.addEventListener('visibilitychange', refresh)
        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', refresh)
        }
    }, [])

    if (!nowPlaying) return null

    const { track, isPlaying } = nowPlaying
    return (
        <li className='nav-item'>
            <Link href={`/song/${track.id}`} className='nav-link text-truncate' style={{ maxWidth: '22rem' }}
                title={`${isPlaying ? 'Now playing' : 'Paused'}: ${track.name} · ${track.artists.join(', ')}`}>
                <span className='badge main-color me-2'>{isPlaying ? '▶ Now playing' : '❚❚ Paused'}</span>
                {track.name} <span className='text-white-50'>· {track.artists.join(', ')}</span>
            </Link>
        </li>
    )
}
