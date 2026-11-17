import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import SpotifyEmbed from '../../components/spotifyEmbed'
import BackLink from '../../components/backLink'
import PageLoader from '../../components/pageLoader'
import statisticsStyles from '../../styles/statistics.module.css'
import { formatDuration, formatHours, formatReleaseDate } from '../../lib/format'

const capitalize = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : text

export default function Album() {
    const router = useRouter()
    const id = router.query.id
    const [album, setAlbum] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!id) return
        const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }

        const getAlbum = async () => {
            try {
                setError(false)
                const { data } = await axios.get(`/api/album/${id}`, headers)
                setAlbum(data)
            }
            catch (error) {
                if (error.response && error.response.status == 401) {
                    sessionStorage.setItem('callback', `album/${id}`)
                    router.push('/callback')
                    return
                }
                setError(true)
            }
        }
        getAlbum()
    }, [id])

    if (error) {
        return (
            <Layout>
                <div className='text-center p-5'>
                    <h1>:(</h1>
                    <h3>Sorry! Could not load this album</h3>
                </div>
            </Layout>
        )
    }

    if (!album) {
        return <PageLoader />
    }

    const multiDisc = album.tracks.some(track => track.discNumber > 1)
    const details = [
        { label: 'Type', value: capitalize(album.type) },
        { label: 'Released', value: formatReleaseDate(album.releaseDate) },
        { label: 'Tracks', value: album.totalTracks },
        { label: 'Length', value: formatHours(Math.round(album.totalDurationMs / 60000)) },
    ]

    return (
        <Layout>
            <div className={`container py-4 py-lg-5 ${statisticsStyles.page}`}>
                <BackLink />
                <div className='row justify-content-center mt-4'>
                    <div className='col-12 col-lg-10'>
                        <div className='card theme theme-border'>
                            <div className='card-header text-center theme-border'>
                                <p className='text-muted small text-uppercase fw-semibold mb-1'>{capitalize(album.type)}</p>
                                <h2 className='mb-1'>{album.name}</h2>
                                <div>
                                    {album.artists.map((artist, index) =>
                                        <span key={artist.id}>
                                            {index > 0 && ', '}
                                            <Link href={`/artist/${artist.id}`} className='theme fw-semibold'>{artist.name}</Link>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='row g-0'>
                                <div className='col-12 col-md-5 p-3'>
                                    <SpotifyEmbed type='album' id={album.id} height={352} />
                                    <ul className='list-group list-group-flush mt-3'>
                                        {details.map(({ label, value }) =>
                                            <li key={label} className='list-group-item d-flex justify-content-between theme theme-border'>
                                                <span className='fw-semibold'>{label}</span>
                                                <span>{value}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='col-12 col-md-7 p-3'>
                                    <h4 className='mb-3'>Tracklist</h4>
                                    <ol className='list-group list-group-flush'>
                                        {album.tracks.map(track =>
                                            <li key={track.id} className='list-group-item d-flex align-items-center gap-3 theme theme-border'>
                                                <span className={statisticsStyles.muted} style={{ minWidth: '2.5rem' }}>
                                                    {multiDisc ? `${track.discNumber}.${track.trackNumber}` : track.trackNumber}
                                                </span>
                                                <div className='flex-grow-1' style={{ minWidth: 0 }}>
                                                    <Link href={`/song/${track.id}`} className='theme fw-semibold text-decoration-none d-block text-truncate'>
                                                        {track.name}
                                                    </Link>
                                                    <span className={`small ${statisticsStyles.muted}`}>
                                                        {track.explicit && <span className='badge text-bg-secondary me-1'>E</span>}
                                                        {track.artists.map(artist => artist.name).join(', ')}
                                                    </span>
                                                </div>
                                                <span className={statisticsStyles.muted}>{formatDuration(track.durationMs)}</span>
                                            </li>
                                        )}
                                    </ol>
                                    {album.copyrights.length > 0 && (
                                        <div className={`small mt-3 ${statisticsStyles.muted}`}>
                                            {album.copyrights.map(text => <div key={text}>{text}</div>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
