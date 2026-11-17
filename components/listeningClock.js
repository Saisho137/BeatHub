import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ColumnChart from './columnChart'
import styles from '../styles/statistics.module.css'
import { readCache, writeCache, MINUTE } from '../lib/clientCache'
import { formatTimeAgo } from '../lib/format'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const hourLabel = (hour) => `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`

const RECENT_CACHE_MS = 5 * MINUTE

// Plays per hour of day and per weekday, from the last 50 plays
export default function ListeningClock() {
    const [plays, setPlays] = useState(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        const cached = readCache('recentlyPlayed', RECENT_CACHE_MS)
        if (cached) {
            setPlays(cached.value)
            return
        }
        const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        axios.get('/api/recentlyPlayed', headers)
            .then(({ data }) => {
                writeCache('recentlyPlayed', data.plays)
                setPlays(data.plays)
            })
            // Hide the section on errors (an empty clock would wrongly say "no recent plays")
            .catch(() => setFailed(true))
    }, [])

    if (failed || plays === null) return null

    if (plays.length === 0) {
        return (
            <div className='text-center'>
                <h2 className={styles.sectionTitle}>Your listening clock</h2>
                <p className={styles.muted}>No recent plays yet. Listen to some music on Spotify and come back to see when you listen the most.</p>
            </div>
        )
    }

    const dates = plays.map(play => new Date(play.playedAt))
    const hours = Array.from({ length: 24 }, (_, hour) => dates.filter(date => date.getHours() === hour).length)
    // getDay(): 0 = Sunday; shift so the week starts on Monday
    const weekdays = WEEKDAYS.map((_, i) => dates.filter(date => (date.getDay() + 6) % 7 === i).length)

    const hourData = hours.map((value, hour) => ({
        key: hour, value, label: hourLabel(hour),
        tooltip: `${hourLabel(hour)}–${hourLabel((hour + 1) % 24)}: ${value} ${value === 1 ? 'play' : 'plays'}`
    }))
    const weekdayData = weekdays.map((value, i) => ({
        key: WEEKDAYS[i], value, label: WEEKDAYS[i],
        tooltip: `${WEEKDAYS[i]}: ${value} ${value === 1 ? 'play' : 'plays'}`
    }))

    const peakHour = hours.indexOf(Math.max(...hours))
    const first = dates[dates.length - 1]

    return (
        <div className='text-center'>
            <h2 className={styles.sectionTitle}>Your listening clock</h2>
            <p className={styles.muted}>
                Your last {plays.length} plays, since {first.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
                You listen the most around <strong>{hourLabel(peakHour)}</strong>.
            </p>
            <div className='row justify-content-center text-start'>
                <div className='col-12 col-lg-7 mb-4'>
                    <h5 className='text-center'>By hour</h5>
                    <ColumnChart title='Plays per hour of day' data={hourData} valueName='plays' />
                </div>
                <div className='col-12 col-lg-5 mb-4'>
                    <h5 className='text-center'>By day</h5>
                    <ColumnChart title='Plays per weekday' data={weekdayData} valueName='plays' />
                </div>
            </div>
            <div className='row justify-content-center text-start'>
                <div className='col-12 col-lg-8'>
                    <h5 className='text-center'>Recently played</h5>
                    {plays.slice(0, 10).map((play, index) =>
                        <Link key={`${play.playedAt}-${index}`} href={`/song/${play.track.id}`} className={`theme border-bottom theme-border ${styles.trackRow}`}>
                            {play.track.image && <img src={play.track.image} alt='' />}
                            <div className='flex-grow-1' style={{ minWidth: 0 }}>
                                <div className='fw-semibold text-truncate'>{play.track.name}</div>
                                <div className={`small text-truncate ${styles.muted}`}>{play.track.artists.join(', ')}</div>
                            </div>
                            <span className={`small ${styles.muted}`}>{formatTimeAgo(play.playedAt)}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
