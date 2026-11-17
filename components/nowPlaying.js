import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { readCache, writeCache } from '../lib/clientCache'
import { blockedForSeconds } from '../lib/spotifyQuota'
import { formatWait } from '../lib/format'

const REFRESH_MS = 90 * 1000

// Slim strip under the navbar: the song playing on the user's Spotify, or a notice
// while Spotify is rate limiting the app
export default function NowPlaying() {
    const [nowPlaying, setNowPlaying] = useState(null)
    const [blockedSeconds, setBlockedSeconds] = useState(0)

    useEffect(() => {
        const refresh = async () => {
            const blocked = blockedForSeconds()
            setBlockedSeconds(blocked)
            if (blocked > 0 || document.hidden) return

            // Shared between pages: navigating does not trigger a new request
            const cached = readCache('nowPlaying', REFRESH_MS, 'session')
            if (cached) {
                setNowPlaying(cached.value)
                return
            }
            try {
                const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
                const { data } = await axios.get('/api/nowPlaying', headers)
                const value = data.track ? data : null
                writeCache('nowPlaying', value, 'session')
                setNowPlaying(value)
            } catch {
                // Not critical: just hide it (expired sessions are handled by each page)
                setNowPlaying(null)
                setBlockedSeconds(blockedForSeconds())
            }
        }

        refresh()
        // Cheap tick: it only calls Spotify when the cached value is older than REFRESH_MS
        const interval = setInterval(refresh, 15 * 1000)
        document.addEventListener('visibilitychange', refresh)
        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', refresh)
        }
    }, [])

    if (blockedSeconds > 0) {
        return (
            <div className='now-playing-bar'>
                <div className='container-fluid px-3 px-lg-4 py-2 small text-muted'>
                    Spotify is limiting requests right now. Your data will be back in {formatWait(blockedSeconds)}.
                </div>
            </div>
        )
    }

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
