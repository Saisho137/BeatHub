import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from "../../components/layout"
import SpotifyEmbed from '../../components/spotifyEmbed'
import BackLink from '../../components/backLink'
import PageLoader from '../../components/pageLoader'
import { errorMessage } from '../../lib/errorMessage'
import Link from 'next/link'
import { formatDuration, formatReleaseDate } from '../../lib/format'


const Songs = () => {

    const router = useRouter()
    const param = router.query.songs

    const [song, setSong] = useState('')
    const [loadError, setLoadError] = useState(null)

    const getSpecificTrack = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            setLoadError(null)
            const { data } = await axios.get(`/api/song/getSpecificTrack/${param}`, headers)
            setSong(data.getTrack)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `song/${param}`)
                router.push('/callback')
                return
            }
            setLoadError(errorMessage(error, 'Sorry! Could not load this song'))
        }

    }

    useEffect(() => {
        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificTrack(token)
        }
    }, [param])

    if (loadError) {
        return (
            <Layout>
                <div className='container py-5 text-center'>
                    <h3 className='mb-4'>{loadError}</h3>
                    <BackLink />
                </div>
            </Layout>
        )
    }

    if (!song) {
        return <PageLoader />
    }

    const details = [
        { label: 'Album', value: <Link href={`/album/${song.albumId}`} className='theme'>{song.album}</Link> },
        { label: 'Released', value: formatReleaseDate(song.releaseDate) },
        { label: 'Duration', value: formatDuration(song.durationMs) },
        { label: 'Track', value: `${song.trackNumber} of ${song.totalTracks}` },
        { label: 'Type', value: song.albumType ? song.albumType.charAt(0).toUpperCase() + song.albumType.slice(1) : null },
        { label: 'Explicit', value: song.explicit ? 'Yes' : 'No' },
    ].filter(detail => detail.value)

    return (
        <Layout>
            <div className='container py-4 py-lg-5'>
                <BackLink />
                <div className='row justify-content-center mt-4'>
                    <div className='col-12 col-md-10 col-xl-7'>
                        <div className='card theme theme-border'>
                            <div className='card-header theme-border text-center'>
                                <p className='text-muted small text-uppercase fw-semibold mb-1'>Song</p>
                                <h2 className='mb-0'>{song.name}</h2>
                            </div>
                            <div className='p-3'>
                                <SpotifyEmbed type='track' id={song.songId} />
                            </div>
                            <ul className='list-group list-group-flush text-start'>
                                {details.map(({ label, value }) =>
                                    <li key={label} className='list-group-item d-flex justify-content-between gap-3 theme theme-border'>
                                        <span className='text-muted'>{label}</span>
                                        <span className='fw-semibold text-end'>{value}</span>
                                    </li>
                                )}
                            </ul>
                            <div className='card-footer theme-border text-center p-3'>
                                <p className='text-muted small text-uppercase fw-semibold mb-2'>{song.artistId.length > 1 ? 'Artists' : 'Artist'}</p>
                                <div className='d-flex flex-wrap justify-content-center gap-2'>
                                    {song.artistId.map((id, index) => (
                                        <Link key={id} href={`/artist/${id}`} className='text-decoration-none' replace>
                                            <span className='d-inline-block bg-light border theme theme-border'>{song.artistName[index]}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Songs
