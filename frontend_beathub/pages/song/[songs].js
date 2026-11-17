import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import SpotifyEmbed from '../../components/spotifyEmbed'
import Link from 'next/link'

const formatDuration = (ms) => {
    const totalSeconds = Math.round(ms / 1000)
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

const formatReleaseDate = (date) => {
    if (!date) return null
    // Spotify dates can be "YYYY", "YYYY-MM" or "YYYY-MM-DD"
    if (date.length < 10) return date.slice(0, 4)
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const Songs = () => {

    const router = useRouter()
    const param = router.query.songs

    const [song, setSong] = useState('')

    const getSpecificTrack = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`/api/song/getSpecificTrack/${param}`, headers)
            setSong(data.getTrack)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `song/${param}`)
                router.push('/callback')
                return
            }
        }

    }

    useEffect(() => {
        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificTrack(token)
        }
    }, [param])

    if (!song) {
        return <h1>Loading...</h1>
    }

    const details = [
        { label: 'Album', value: song.album },
        { label: 'Released', value: formatReleaseDate(song.releaseDate) },
        { label: 'Duration', value: formatDuration(song.durationMs) },
        { label: 'Track', value: `${song.trackNumber} of ${song.totalTracks}` },
        { label: 'Type', value: song.albumType ? song.albumType.charAt(0).toUpperCase() + song.albumType.slice(1) : null },
        { label: 'Explicit', value: song.explicit ? 'Yes' : 'No' },
    ].filter(detail => detail.value)

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 border'>
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success main-color main-border'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
                <h1 className={`${styles.artisttitle}`}>Song</h1>
                <div className={`row mb-5 justify-content-center`}>
                    <div className={`col-11 col-md-9 col-xl-6 ${styles.singleartist}`}>
                        <div className={`card theme theme-border`}>
                            <h3 className="card-title card-header theme-border">{song.name}</h3>
                            <div className='p-3'>
                                <SpotifyEmbed type='track' id={song.songId} />
                            </div>
                            <ul className='list-group list-group-flush text-start'>
                                {details.map(({ label, value }) =>
                                    <li key={label} className='list-group-item d-flex justify-content-between theme theme-border'>
                                        <span className='fw-semibold'>{label}</span>
                                        <span>{value}</span>
                                    </li>
                                )}
                            </ul>
                            <div>
                                <h4 className='card-footer mt-3 theme-border'>{song.artistId.length > 1 ? 'Artists' : 'Artist'}</h4>
                                {song.artistId.map((id, index) => (
                                    <Link key={id} href={`/artist/${id}`} className='text-decoration-none text-dark' replace>
                                        <p className='mb-3 bg-light border border-dark d-inline-block p-2 m-1 rounded theme theme-border'>
                                            {song.artistName[index]}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Songs
