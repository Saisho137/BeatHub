import statisticsStyles from '../styles/statistics.module.css'
import Layout from '../components/layout'
import PageLoader from '../components/pageLoader'
import StatTile from '../components/statTile'
import ColumnChart from '../components/columnChart'
import ListeningClock from '../components/listeningClock'
import { formatDuration, formatHours, formatNumber } from '../lib/format'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const PERIODS = [
    { key: 'short_term', label: '4 Weeks' },
    { key: 'medium_term', label: '6 Months' },
    { key: 'long_term', label: 'All Time' },
]


const decadeData = (decades, total) => decades.map(({ decade, count }) => ({
    key: decade,
    label: `'${String(decade).slice(2)}s`,
    value: count,
    tooltip: `${decade}s: ${count} ${count === 1 ? 'song' : 'songs'} (${Math.round(100 * count / total)}%)`
}))

function ChipList({ items, type }) {
    return (
        <div className={statisticsStyles.chipList}>
            {items.map(item =>
                <Link key={item.id} href={`/${type}/${item.id}`} className={`theme theme-border ${statisticsStyles.chip}`}>
                    <img src={item.images ? item.images.url : '/images/person-circle.svg'} alt='' />
                    <span>{item.name}</span>
                </Link>
            )}
        </div>
    )
}

export default function Statistics() {

    const router = useRouter()
    const [time, setTime] = useState('long_term')
    const [stats, setStats] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const storedTime = sessionStorage.getItem('statisticsTime')
        if (storedTime) setTime(storedTime)

        const getStats = async () => {
            const headers = {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            }
            try {
                const { data } = await axios.get('/api/stats', headers)
                setStats(data)
            }
            catch (error) {
                // Only re-login on an expired token; other errors would cause a login loop
                if (error.response && error.response.status == 401) {
                    sessionStorage.setItem('callback', 'statistics')
                    router.push('/callback')
                    return
                }
                setError(true)
            }
        }

        getStats()
    }, [])

    const selectPeriod = (period) => {
        setTime(period)
        sessionStorage.setItem('statisticsTime', period)
    }

    if (error) {
        return (
            <Layout>
                <div className='text-center mt-5 p-5'>
                    <h1>:(</h1>
                    <h3>Sorry! Could not load your statistics</h3>
                </div>
            </Layout>
        )
    }

    if (!stats) {
        return <PageLoader label='Loading statistics' />
    }

    const { tracks, artists, insights } = stats.periods[time]
    const { comparison } = stats
    const hasComparison = comparison.newArtists.length > 0 || comparison.newTracks.length > 0 || comparison.loyalArtists.length > 0

    return (
        <Layout>
            <div className={`container py-4 py-lg-5 ${statisticsStyles.page}`}>

                {/* User's Profile */}
                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 text-center text-sm-start'>
                    <img src={stats.user.images?.[0] ? stats.user.images[0].url : 'images/person-circle.svg'}
                        className='rounded-circle'
                        style={{ width: '88px', height: '88px', objectFit: 'cover', boxShadow: 'var(--shadow)' }}
                        alt='User Profile Picture'
                    />
                    <div>
                        <h1 className='mb-0'>{stats.user.display_name}</h1>
                        <p className={`mb-0 ${statisticsStyles.muted}`}>
                            <Link href='/library' className='theme'>{formatNumber(stats.user.savedTracks)} saved songs</Link>
                            {' · '}{formatNumber(stats.user.followedArtists)} followed artists
                            {' · '}{formatNumber(stats.user.playlists)} playlists
                        </p>
                    </div>
                </div>

                {/* Period selector */}
                <div className={statisticsStyles.periodBar}>
                    <div className={statisticsStyles.segmented} role='group' aria-label='Period'>
                        {PERIODS.map(({ key, label }) =>
                            <button
                                key={key}
                                type='button'
                                aria-pressed={time == key}
                                className={`rounded-pill ${time == key ? 'time-btn-on' : 'time-btn-off'}`}
                                onClick={() => selectPeriod(key)}>{label}</button>
                        )}
                    </div>
                </div>

                {!insights ? (
                    <div className='text-center p-5'>
                        <h3>Not enough listening activity in this period</h3>
                        <p>Try a longer period.</p>
                    </div>
                ) : (
                    <>
                        {/* Headline numbers */}
                        <h2 className={`text-center ${statisticsStyles.sectionTitle}`}>Your top {insights.trackCount} songs</h2>
                        <div className='row justify-content-center'>
                            <StatTile label='of music' value={formatHours(insights.totalMinutes)} detail='if you played them all' />
                            <StatTile label='average year' value={insights.averageYear ?? '—'} detail='your music age' />
                            <StatTile label='artists' value={insights.uniqueArtists} detail='behind those songs' />
                            <StatTile label='average length' value={formatDuration(insights.averageDurationMs)} detail='minutes per song' />
                            <StatTile label='singles' value={`${insights.singlesPercent}%`} detail='not from an album' />
                            <StatTile label='explicit' value={`${insights.explicitPercent}%`} detail='of your songs' />
                        </div>

                        {/* Highlights */}
                        <div className='row justify-content-center mt-4'>
                            {tracks[0] && (
                                <div className='col-6 col-lg-3 mb-3'>
                                    <Link href={`/song/${tracks[0].id}`} className='card h-100 text-center text-decoration-none theme theme-border'>
                                        <h5 className='card-header theme-border'>Top Track</h5>
                                        <img src={tracks[0].images?.url} alt='' className='rounded p-3 mx-auto d-block' style={{ width: '80%' }} />
                                        <div className='card-body pt-0'>
                                            <h6 className='card-title mb-0'>{tracks[0].name}</h6>
                                            <p className={`small mb-0 ${statisticsStyles.muted}`}>{tracks[0].artists.join(', ')}</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {artists[0] && (
                                <div className='col-6 col-lg-3 mb-3'>
                                    <Link href={`/artist/${artists[0].id}`} className='card h-100 text-center text-decoration-none theme theme-border'>
                                        <h5 className='card-header theme-border'>Top Artist</h5>
                                        <img src={artists[0].images ? artists[0].images.url : '/images/person-circle.svg'} alt='' className='rounded-circle p-3 mx-auto d-block' style={{ width: '80%', aspectRatio: '1', objectFit: 'cover' }} />
                                        <div className='card-body pt-0'>
                                            <h6 className='card-title mb-0'>{artists[0].name}</h6>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            <div className='col-12 col-lg-6 mb-3'>
                                <div className='card h-100 theme theme-border'>
                                    <h5 className='card-header text-center theme-border'>Fun facts</h5>
                                    <ul className='list-group list-group-flush'>
                                        {insights.topArtist && insights.topArtist.count > 1 && (
                                            <li className='list-group-item theme theme-border'>
                                                <strong>{insights.topArtist.count}</strong> of your top songs are by{' '}
                                                <Link href={`/artist/${insights.topArtist.id}`} className='theme'>{insights.topArtist.name}</Link>
                                            </li>
                                        )}
                                        {insights.oldest && (
                                            <li className='list-group-item theme theme-border'>
                                                Oldest: <Link href={`/song/${insights.oldest.id}`} className='theme'>{insights.oldest.name}</Link>
                                                {' '}<span className={statisticsStyles.muted}>({insights.oldest.year})</span>
                                            </li>
                                        )}
                                        {insights.newest && insights.newest.id !== insights.oldest?.id && (
                                            <li className='list-group-item theme theme-border'>
                                                Newest: <Link href={`/song/${insights.newest.id}`} className='theme'>{insights.newest.name}</Link>
                                                {' '}<span className={statisticsStyles.muted}>({insights.newest.year})</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Decades */}
                        {insights.decades.length > 0 && (
                            <div className='row justify-content-center'>
                                <div className='col-12 col-lg-8'>
                                    <h2 className={`text-center ${statisticsStyles.sectionTitle}`}>Your decades</h2>
                                    <p className={`text-center ${statisticsStyles.muted}`}>Release decade of your top songs</p>
                                    <ColumnChart title='Songs per decade' data={decadeData(insights.decades, insights.trackCount)} />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Lately vs all time (independent of the selected period) */}
                {hasComparison && (
                    <div className='text-center'>
                        <h2 className={statisticsStyles.sectionTitle}>Lately vs. all time</h2>
                        {comparison.newArtists.length > 0 && (
                            <div className='mb-4'>
                                <h5>New obsessions</h5>
                                <p className={`small ${statisticsStyles.muted}`}>Artists in your last 4 weeks that are not in your all-time top</p>
                                <ChipList items={comparison.newArtists} type='artist' />
                            </div>
                        )}
                        {comparison.newTracks.length > 0 && (
                            <div className='mb-4'>
                                <h5>On repeat lately</h5>
                                <p className={`small ${statisticsStyles.muted}`}>Songs in your last 4 weeks that are not in your all-time top</p>
                                <ChipList items={comparison.newTracks} type='song' />
                            </div>
                        )}
                        {comparison.loyalArtists.length > 0 && (
                            <div className='mb-4'>
                                <h5>Always there</h5>
                                <p className={`small ${statisticsStyles.muted}`}>Artists in your top for every period</p>
                                <ChipList items={comparison.loyalArtists} type='artist' />
                            </div>
                        )}
                    </div>
                )}

                {/* Listening clock (independent of the selected period) */}
                <ListeningClock />

                {/* Top songs list */}
                {tracks.length > 0 && (
                    <div className='row text-center' id='topTracks'>
                        <h2 className={statisticsStyles.sectionTitle}>Top Songs</h2>
                        <div className='col-12 row justify-content-center mx-0'>
                            {tracks.map((track, index) =>
                                <Link key={track.id} href={`/song/${track.id}`} className='text-decoration-none card col-5 col-md-3 col-lg-2 m-2 p-0 theme theme-border'>
                                    <img src={track.images?.url} className='card-img-top' alt='Album image' />
                                    <div className='card-body'>
                                        <h6 className='card-title'>{index + 1}. {track.name}</h6>
                                    </div>
                                    <div className='card-footer theme-border'>
                                        <p className={`small mb-0 ${statisticsStyles.muted}`}>{track.artists.join(', ')}</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Top Artists list */}
                {artists.length > 0 && (
                    <div className='row text-center' id='topArtists'>
                        <h2 className={statisticsStyles.sectionTitle}>Top Artists</h2>
                        <div className='col-12 row justify-content-center mx-0'>
                            {artists.map((artist, index) =>
                                <Link key={artist.id} href={`/artist/${artist.id}`} className='text-decoration-none card col-5 col-md-3 col-lg-2 m-2 p-0 theme theme-border'>
                                    <img src={artist.images ? artist.images.url : 'images/person-circle.svg'} className='card-img-top' style={{ aspectRatio: '1', objectFit: 'cover' }} alt='Artist image' />
                                    <div className='card-body d-flex align-items-end'>
                                        <h6 className='card-title'>{index + 1}. {artist.name}</h6>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <button
                    type='button'
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='icon-button'
                    style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, width: '48px', height: '48px', boxShadow: 'var(--shadow)' }}
                    aria-label='Back to top'
                >
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M18 15l-6-6-6 6' /></svg>
                </button>
            </div>
        </Layout>
    )
}
