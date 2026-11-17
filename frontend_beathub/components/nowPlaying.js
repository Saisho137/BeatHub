import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const REFRESH_MS = 30000

// Slim strip under the navbar with the song playing on the user's Spotify
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
        <div className='now-playing-bar'>
            <div className='container-fluid px-3 px-lg-4'>
                <Link href={`/song/${track.id}`} title={`${track.name} · ${track.artists.join(', ')}`}>
                    <span className={`equalizer ${isPlaying ? '' : 'paused'}`} aria-hidden='true'>
                        <span /><span /><span />
                    </span>
                    <span className='text-muted flex-shrink-0'>{isPlaying ? 'Now playing' : 'Paused'}</span>
                    <span className='text-truncate'>
                        <span className='fw-semibold'>{track.name}</span>
                        <span className='text-muted'> · {track.artists.join(', ')}</span>
                    </span>
                </Link>
            </div>
        </div>
    )
}
