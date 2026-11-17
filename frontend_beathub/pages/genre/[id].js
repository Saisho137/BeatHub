import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/layout'
import BackLink from '../../components/backLink'
import PageLoader from '../../components/pageLoader'
import statisticsStyles from '../../styles/statistics.module.css'

export async function getServerSideProps(context) {
    const { id } = context.params

    return {
        props: {
            id
        }
    }
}

export default function GenrePage({ id }) {

    const router = useRouter()
    const [tracks, setTracks] = useState('')
    const [artists, setArtists] = useState('')

    async function getGenresTopTracks(headers) {
        try {
            const { data: { getTopTracksGenre } } = await axios.get(`/api/genre/getTopTracksGenre/${id}`, headers)
            setTracks(getTopTracksGenre)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `genre/${id}`)
                router.push('/callback')
                return
            }
            setTracks([])
        }
    }

    async function getGenresTopArtists(headers) {
        try {
            const { data: { getTopArtistGenre } } = await axios.get(`/api/genre/getTopArtistGenre/${id}`, headers)
            setArtists(getTopArtistGenre)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `genre/${id}`)
                router.push('/callback')
                return
            }
            setArtists([])
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token')

        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        getGenresTopTracks(headers)
        getGenresTopArtists(headers)

    }, [id])

    /* While the page gets a response from API */
    if (typeof tracks != 'object' || typeof artists != 'object') {
        return <PageLoader />
    }

    /* If API made a response but there were no artists or tracks */
    if (!tracks[0] && !artists[0]) {
        return (
            <Layout>
                <div className='container py-5 text-center'>
                    <h1>:(</h1>
                    <h2 className='mb-4'>Sorry! Could not find the genre</h2>
                    <BackLink />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className={`container py-4 py-lg-5 ${statisticsStyles.page}`}>
                <BackLink />
                <div className='text-center mt-3 mb-4'>
                    <p className='text-muted small text-uppercase fw-semibold mb-1'>Genre</p>
                    <h1 className='text-capitalize mb-0'>{id}</h1>
                </div>

                <div className='row g-4'>
                    {/* Top tracks list */}
                    <div className='col-12 col-xl-6'>
                        <h3 className='mb-3'>Top Tracks</h3>
                        {tracks[0]
                            ? <div className='card theme theme-border px-3'>
                                {tracks.map((track, index) =>
                                    <Link key={track.id} href={`/song/${track.id}`} className={`theme ${index > 0 ? 'border-top theme-border' : ''} ${statisticsStyles.trackRow}`}>
                                        <img src={track.images} alt='' />
                                        <div style={{ minWidth: 0 }}>
                                            <div className='fw-semibold text-truncate'>{track.name}</div>
                                            <div className='small text-muted text-truncate'>{track.artist}</div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            : <p className='text-muted'>Sorry! Could not find related tracks</p>}
                    </div>

                    {/* Top artists list */}
                    <div className='col-12 col-xl-6'>
                        <h3 className='mb-3'>Top Artists</h3>
                        {artists[0]
                            ? <div className='row g-3'>
                                {artists.map(artist =>
                                    <div key={artist.id} className='col-6 col-md-4'>
                                        <Link href={`/artist/${artist.id}`} className='card h-100 text-decoration-none theme theme-border'>
                                            <img src={artist.images ? artist.images : '/images/person-circle.svg'}
                                                className='card-img-top' style={{ aspectRatio: '1', objectFit: 'cover' }} alt='' />
                                            <div className='card-body p-3'>
                                                <h6 className='card-title mb-0 text-truncate'>{artist.name}</h6>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            : <p className='text-muted'>Sorry! Could not find related artists</p>}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
