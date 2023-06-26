import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';



const Artist = () => {
    const [artist, setArtist] = useState('')
    const [similar, setSimilar] = useState('')

    const router = useRouter()
    const param = router.query.artist

    const getSpecificArtist = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`http://localhost:8080/getSpecificArtist/${param}`, headers)
        setArtist(data.getSpecificArtist)
    }

    const getSimilarArtist = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`http://localhost:8080/getSimilarArtist/${param}`, headers)
        setSimilar(data.getSimilarArtist)
    }


    useEffect(() => {

        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificArtist(token)
            getSimilarArtist(token)
            if (!token) {
                console.log("lol")
            }
        }
    }, [param]);

    if (!artist) {
        return <h1>Loading...</h1>
    }
    console.log(similar);

    return (
        <>
            <div className='row'>
            <main className="col-12 col-md-10 col-xl-5">
                <Image loader={() => artist.images} src={artist.images} height={150} width={150} alt="Picture of the author" />
                <p>{artist.name}</p>
                {artist.genres.map((genres) => <p>{genres}</p>)}
            </main>
            <main className="col-12 col-md-10 col-xl-7">
                <ul>{similar.map((name) => <Image loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />)}</ul>
            </main>
            </div>
        </>
    )
}

export default Artist;
