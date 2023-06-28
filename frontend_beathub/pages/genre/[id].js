import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
    const [tracks, setTracks] = useState([])
    const [artists, setArtists] = useState([])

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

    }, [])


    if (!genres[0] || !tracks[0] || !artists[0]) {
        return <p>Loading...</p>
    }

    console.log(genres);
    console.log(tracks);
    console.log(artists);

    return (
        <div className='row text-center offset-1 col-10 mt-5 pt-5 border'>
            <h1 className='text-capitalize'>{id}</h1>
            <div className='offset-xl-1 col-xl-5 mt-5 mb-5 border-end'>
                <h3 className='mb-5'>Top Tracks</h3>
                {tracks.map(track =>
                    <div key={track.id} className='card col-11 mb-3'>
                        <div className='row g-0 d-flex align-items-center'>
                            <div className='col-2'>
                                <img src={track.images} className='img-fluid rounded-start' alt='Album picture' />
                            </div>
                            <div className='col-8 card-body'>
                                <h6 className='text-start card-title'>{track.name}</h6>
                                <p className='text-start card-text text-muted'>{track.artist}</p>
                            </div>
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
                        <div key={artist.id} href={`/artist/${artist.id}`} className='text-decoration-none text-dark card col-5 col-md-4 col-xl-3 m-2 p-0'>
                            <img src={artist.images ? artist.images : '/images/person-circle.svg'} className='card-img-top h-100' alt='Artist image' />
                            <div className='card-body'>
                                <h6 className='card-title'>{artist.name}</h6>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 