import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/layout'

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
        return (
            <Layout>
                <div className='d-flex justify-content-center align-items-center' style={{ height: '30em' }}>
                    <div className="spinner-border text-dark d-flex justify-content-center" role="status" style={{ width: '5em', height: '5em' }}>
                    </div>
                </div>
            </Layout>
        )
    }

    /* If API made a response but there were no artists or tracks */
    if (!tracks[0] && !artists[0]) {
        return (
            <Layout>
                <div className='row justify-content-center text-center mt-5 p-5 theme theme-border'>
                    <h1>:(</h1>
                    <h1>Sorry! Could not find the genre</h1>
                    <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success main-color main-border'>
                        <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                        Search More
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 border'>

                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success main-color main-border'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>

                <h1 className='text-capitalize'>{id}</h1>

                {/* Top tracks list */}
                <div className='offset-xl-1 col-xl-5 mt-5 mb-5 border-end'>
                    <h3 className='mb-5'>Top Tracks</h3>
                    {tracks[0]
                        ? tracks.map(track =>
                            <div key={track.id} className='card col-10 mb-3 theme theme-border'>
                                <div className='row g-0 d-flex align-items-center'>
                                    <Link href={`/song/${track.id}`} className='col-2 text-decoration-none'>
                                        <img src={track.images} className='img-fluid rounded-start' alt='Album picture' />
                                    </Link>
                                    <Link href={`/song/${track.id}`} className='col-10 card-body text-decoration-none'>
                                        <h6 className='text-start card-title'>{track.name}</h6>
                                        <p className='text-start card-text text-muted theme'>{track.artist}</p>
                                    </Link>
                                </div>
                            </div>
                        )
                        : <div className='card row justify-content-center text-center p-3 theme theme-border'>
                            <h4>:(</h4>
                            <p className='fs-5'>Sorry! Could not find related tracks</p>
                        </div>}
                </div>

                {/* Top artists list */}
                <div className='col-xl-6 mt-5 mb-5 border-start'>
                    <h3 className='mb-5'>Top Artists</h3>
                    <div className='offset-1 col-10 row justify-content-center'>
                        {artists[0]
                            ? artists.map(artist =>
                                <Link
                                    key={artist.id}
                                    href={`/artist/${artist.id}`}
                                    className='text-decoration-none text-dark card col-5 col-md-4 col-xl-3 m-2 p-0'>
                                    <img
                                        src={artist.images ? artist.images : '/images/person-circle.svg'}
                                        className='card-img-top h-100'
                                        alt='Artist image' />
                                    <div className='card-body theme'>
                                        <h6 className='card-title'>{artist.name}</h6>
                                    </div>
                                </Link>
                            )
                            : <div className='card row justify-content-center text-center p-3 theme theme-border'>
                                <h4>:(</h4>
                                <p className='fs-5'>Sorry! Could not find related artists</p>
                            </div>}
                    </div>
                </div>
            </div>
        </Layout>
    )
} 