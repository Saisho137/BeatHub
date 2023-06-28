import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/* export async function getServerSideProps(context) {


    

    const headers = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    const genres = await axios.get('htpp://localhost:8080/getGenre', headers)

    return {
        props: {
            id,
            genres: genres.data
        }
    }
} */

export default function GenrePage() {

    const router = useRouter()
    const [genres, setGenres] = useState([])
    const [tracks, setTracks] = useState([])
    const [artists, setArtists] = useState([])

    const { id } = router.query
    console.log(id);

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

    
    if (!genres) {
        return null
    }

    console.log(genres);
    console.log(tracks);
    console.log(artists);

    return (
        <div className='row text-center mt-5'>
            <h1>{id}</h1>
            <div className='offset-md-1 col-md-5 mt-5 border'>
                <h3>Top Tracks</h3>
            </div>
            <div className='col-md-5 mt-5 border'>
                <h3>Top Artists</h3>
            </div>
        </div>
    )
} 