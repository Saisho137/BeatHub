import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PreviewSong from '../../components/previewSong'
import playButton from '../../public/images/play-fill.svg'

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
    const [genres, setGenres] = useState([])
    const [tracks, setTracks] = useState('')
    const [artists, setArtists] = useState('')

    async function getGenres(headers) {
        const { data: { getGenre: { genres } } } = await axios.get('http://localhost:8080/getGenre', headers)
        setGenres(genres)
    }

    async function getGenresTopTracks(headers) {
        const { data: { getTopTracksGenre } } = await axios.get(`http://localhost:8080/getTopTracksGenre/${id}`, headers)
        setTracks(getTopTracksGenre)
    }

    async function getGenresTopArtists(headers) {
        const { data: { getTopArtistGenre } } = await axios.get(`http://localhost:8080/getTopArtistGenre/${id}`, headers)
        setArtists(getTopArtistGenre)
    }

    useEffect(() => {

        const token = sessionStorage.getItem('token')

        if (!token) {
            router.push('/')
        }

        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        getGenres(headers)
        getGenresTopTracks(headers)
        getGenresTopArtists(headers)

    }, [id])

    console.log(typeof tracks);
    if (!tracks[0] && !artists[0] && genres[0] && typeof tracks == 'object' && typeof artists == 'object') {
        return (
            <div className='row justify-content-center text-center mt-5 p-5'>
                <h1>:(</h1>
                <h1>Sorry! Could not find the genre</h1>
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
            </div>
        )
    }

    if (!tracks[0] || !artists[0]) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '30em' }}>
                <div className="spinner-border text-dark d-flex justify-content-center" role="status" style={{ width: '5em', height: '5em' }}>
                </div>
            </div>
        )
    }



    console.log(id);

    return (
        <div className='row text-center offset-1 col-10 mt-5 border'>
            <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success'>
                <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                Search More
            </Link>
            <h1 className='text-capitalize'>{id}</h1>
            <div className='offset-xl-1 col-xl-5 mt-5 mb-5 border-end'>
                <h3 className='mb-5'>Top Tracks</h3>
                {tracks.map(track =>
                    <div key={track.id} className='card col-11 mb-3'>
                        <div className='row g-0 d-flex align-items-center'>
                            <Link href={`/song/${track.id}`} className='col-2 text-decoration-none'>
                                <img src={track.images} className='img-fluid rounded-start' alt='Album picture' />
                            </Link>
                            <Link href={`/song/${track.id}`} className='col-8 card-body text-decoration-none'>
                                <h6 className='text-start card-title'>{track.name}</h6>
                                <p className='text-start card-text text-muted'>{track.artist}</p>
                            </Link>
                            <div className='col-2 h-100'>
                                <PreviewSong preview={track.preview} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='col-xl-6 mt-5 mb-5 border-start'>
                <h3 className='mb-5'>Top Artists</h3>
                <div className='offset-1 col-10 row justify-content-center'>
                    {artists.map(artist =>
                        <Link key={artist.id} href={`/artist/${artist.id}`} className='text-decoration-none text-dark card col-5 col-md-4 col-xl-3 m-2 p-0'>
                            <img src={artist.images ? artist.images : '/images/person-circle.svg'} className='card-img-top h-100' alt='Artist image' />
                            <div className='card-body'>
                                <h6 className='card-title'>{artist.name}</h6>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            <h3 className='mb-5'>More Genres</h3>
            <div className='row text-center pb-5'>
                <div className='offset-2 col-8'>
                    {genres.map((genre) =>
                        <Link key={genre} href={`/genre/${genre}`} className='text-decoration-none text-dark' replace>
                            <p className='bg-light border border-dark d-inline-block p-2 m-1 rounded' >{genre}</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
} 