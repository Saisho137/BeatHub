import statisticsStyles from '../styles/statistics.module.css'
import Layout from '../components/layout'
import { errorMessage } from '../lib/errorMessage'
import StatTile from '../components/statTile'
import ColumnChart from '../components/columnChart'
import BarList from '../components/barList'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { computeLibraryInsights } from '../lib/libraryInsights'
import { formatHours, formatNumber, formatReleaseDate, formatTimeAgo, yearOf } from '../lib/format'
import { readCache, writeCache, HOUR } from '../lib/clientCache'
import { blockedForSeconds } from '../lib/spotifyQuota'

const CHUNK_SIZE = 250 // must match PAGES_PER_CHUNK * PAGE_SIZE in /api/library
const LIBRARY_CACHE_MS = 24 * HOUR

function TrackHighlight({ title, track, detail }) {
    if (!track) return null
    return (
        <div className='col-12 col-md-4 mb-3'>
            <Link href={`/song/${track.id}`} className='card h-100 text-decoration-none theme theme-border'>
                <h6 className='card-header text-center theme-border'>{title}</h6>
                <div className={`card-body p-3 ${statisticsStyles.trackRow}`}>
                    {track.image && <img src={track.image} alt='' />}
                    <div className='text-start' style={{ minWidth: 0 }}>
                        <div className='fw-semibold text-truncate'>{track.name}</div>
                        <div className={`small text-truncate ${statisticsStyles.muted}`}>{track.artists.map(a => a.name).join(', ')}</div>
                        <div className={`small ${statisticsStyles.muted}`}>{detail}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default function Library() {
    const router = useRouter()
    const [progress, setProgress] = useState({ loaded: 0, total: null })
    const [insights, setInsights] = useState(null)
    const [error, setError] = useState(null)
    const [savedAt, setSavedAt] = useState(null)
    // Incremented by the Refresh button to analyze the library again
    const [reloadCount, setReloadCount] = useState(0)

    useEffect(() => {
        let cancelled = false
        const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }

        // Analyzing a library costs dozens of Spotify requests: reuse the last result for a day
        const cached = reloadCount === 0 && readCache('library', LIBRARY_CACHE_MS)
        if (cached) {
            setInsights(cached.value)
            setSavedAt(cached.savedAt)
            return
        }

        setInsights(null)
        setError(null)
        setProgress({ loaded: 0, total: null })

        const loadLibrary = async () => {
            const tracks = []
            let total = Infinity
            try {
                for (let offset = 0; offset < total && !cancelled; offset += CHUNK_SIZE) {
                    const { data } = await axios.get(`/api/library?offset=${offset}`, headers)
                    total = data.total
                    tracks.push(...data.tracks)
                    if (!cancelled) setProgress({ loaded: Math.min(offset + CHUNK_SIZE, total), total })
                }
                if (!cancelled) {
                    const result = computeLibraryInsights(tracks) || 'empty'
                    writeCache('library', result)
                    setInsights(result)
                    setSavedAt(Date.now())
                }
            }
            catch (error) {
                if (cancelled) return
                if (error.response && error.response.status == 401) {
                    sessionStorage.setItem('callback', 'library')
                    router.push('/callback')
                    return
                }
                setError(errorMessage(error, 'Sorry! Could not load your library'))
            }
        }

        loadLibrary()
        return () => { cancelled = true }
    }, [reloadCount])

    let content
    if (error) {
        content = (
            <div className='text-center p-5'>
                <h1>:(</h1>
                <h3>{error}</h3>
            </div>
        )
    } else if (!insights) {
        const percent = progress.total ? Math.round(100 * progress.loaded / progress.total) : 0
        content = (
            <div className='text-center p-5 mx-auto' style={{ maxWidth: '480px' }}>
                <h3>Analyzing your library…</h3>
                <p className={statisticsStyles.muted}>
                    {progress.total == null ? 'Getting your saved songs' : `${formatNumber(progress.loaded)} of ${formatNumber(progress.total)} songs`}
                </p>
                <div className={statisticsStyles.progressTrack} role='progressbar' aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className={statisticsStyles.progressFill} style={{ width: `${percent}%` }} />
                </div>
            </div>
        )
    } else if (insights === 'empty') {
        content = (
            <div className='text-center p-5'>
                <h3>Your library is empty</h3>
                <p className={statisticsStyles.muted}>Save songs in Spotify (the ♡ button) to see your library statistics.</p>
            </div>
        )
    } else {
        const savedData = insights.savedPerYear.map(({ key, value }) => ({
            key, value, label: `'${String(key).slice(2)}`,
            tooltip: `${key}: ${formatNumber(value)} songs saved`
        }))
        const decadeData = insights.decades.map(({ key, value }) => ({
            key, value, label: `'${String(key).slice(2)}s`,
            tooltip: `${key}s: ${formatNumber(value)} songs (${Math.round(100 * value / insights.total)}%)`
        }))

        content = (
            <>
                <div className='row justify-content-center mt-4'>
                    <StatTile label='saved songs' value={formatNumber(insights.total)} detail='in your library' />
                    <StatTile label='of music' value={formatHours(insights.totalMinutes)} detail='to play it all' />
                    <StatTile label='artists' value={formatNumber(insights.uniqueArtists)} detail='in your library' />
                    <StatTile label='average year' value={insights.averageYear ?? '—'} detail='of release' />
                    <StatTile label='explicit' value={`${insights.explicitPercent}%`} detail='of your songs' />
                    <StatTile label='busiest year' value={insights.busiestYear.key} detail={`${formatNumber(insights.busiestYear.value)} songs saved`} />
                </div>

                <div className='row justify-content-center mt-3'>
                    <TrackHighlight title='Your first saved song' track={insights.firstSaved} detail={`Saved ${formatReleaseDate(insights.firstSaved.addedAt.slice(0, 10))}`} />
                    <TrackHighlight title='Latest saved song' track={insights.lastSaved} detail={`Saved ${formatReleaseDate(insights.lastSaved.addedAt.slice(0, 10))}`} />
                    <TrackHighlight title='Oldest song' track={insights.oldestSong} detail={insights.oldestSong && `Released ${yearOf(insights.oldestSong.releaseDate)}`} />
                </div>

                <div className='row justify-content-center'>
                    <div className='col-12 col-lg-8'>
                        <h2 className={`text-center ${statisticsStyles.sectionTitle}`}>Songs saved per year</h2>
                        <p className={`text-center ${statisticsStyles.muted}`}>When you added songs to your library</p>
                        <ColumnChart title='Songs saved per year' data={savedData} />
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col-12 col-lg-8'>
                        <h2 className={`text-center ${statisticsStyles.sectionTitle}`}>Library by decade</h2>
                        <p className={`text-center ${statisticsStyles.muted}`}>Release decade of your saved songs</p>
                        <ColumnChart title='Saved songs per release decade' data={decadeData} />
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col-12 col-lg-8'>
                        <h2 className={`text-center ${statisticsStyles.sectionTitle}`}>Most saved artists</h2>
                        <BarList items={insights.topArtists.map(artist => ({ ...artist, href: `/artist/${artist.id}` }))} />
                    </div>
                </div>
            </>
        )
    }

    return (
        <Layout>
            <div className={`container pb-5 ${statisticsStyles.page}`}>
                <h1 className='text-center mt-5'>Your Library</h1>
                <p className={`text-center ${statisticsStyles.muted}`}>Everything you have saved with ♡ in Spotify</p>
                {insights && savedAt && (
                    <p className={`text-center small ${statisticsStyles.muted}`}>
                        Analyzed {formatTimeAgo(savedAt)} ·{' '}
                        <button type='button' className='btn btn-link btn-sm p-0 align-baseline' style={{ color: 'var(--brand)' }}
                            disabled={blockedForSeconds() > 0} title={blockedForSeconds() > 0 ? 'Spotify is limiting requests right now' : undefined}
                            onClick={() => setReloadCount(count => count + 1)}>
                            Refresh
                        </button>
                    </p>
                )}
                {content}
            </div>
        </Layout>
    )
}
