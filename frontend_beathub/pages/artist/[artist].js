import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import PreviewSong from '../../components/previewSong'
import Link from 'next/link'



const Artist = () => {
    const [artist, setArtist] = useState('')
    const [similar, setSimilar] = useState([])
    const [topTracks, setTopTracks] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)

    const router = useRouter()
    const param = router.query.artist

    const getSpecificArtist = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`/api/artist/getSpecificArtist/${param}`, headers)
            setArtist(data.getSpecificArtist)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `artist/${param}`)
                router.push('/callback')
                return
            }
        }

    }

    const getSimilarArtist = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`/api/artist/getSimilarArtist/${param}`, headers)
            setSimilar(data.getSimilarArtist)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `artist/${param}`)
                router.push('/callback')
                return
            }
        }
    }

    const getArtistTopTracks = async (token) => {

        if (!token) return

        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`/api/artist/getArtistTopTracks/${param}`, headers)
            setTopTracks(data.getArtistTopTracks)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `artist/${param}`)
                router.push('/callback')
                return
            }
        }
    }


    useEffect(() => {

        router.events.on('routeChangeStart', () => setIsPlaying(false))

        if (param) {
            const token = sessionStorage.getItem('token')

            getSpecificArtist(token)
            getSimilarArtist(token)
            getArtistTopTracks(token)
        }
    }, [param, router])

    if (!artist) {
        return <h1>Loading...</h1>
    }

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 border'>
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success main-color main-border'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
                <h1 className={`${styles.artisttitle}`}>Artist</h1>
                <div className={`row mb-5`}>
                    <div className={`col-11 col-md-7 col-xl-4 ${styles.singleartist}`}>
                        <div className={`card theme theme-border ${styles.artistmargin}`}>
                            <h3 className="card-title card-header theme-border" style={{ marginBottom: "2%" }}>{artist.name}</h3>
                            <div className="card-img">
                                <Link href='/recommender'>
                                    <Image className="rounded" loader={() => artist.images ? artist.images : '/images/person-circle.svg'} src={artist.images ? artist.images : '/images/person-circle.svg'} height={300} width={300} alt="Picture of the author" />
                                </Link>

                            </div>
                            <h4 className='card-footer mt-3 theme-border'>Artist genres</h4>
                            <div>
                                {artist.genres.map((genre) =>
                                    <Link key={genre} href={`/genre/${genre}`} className='text-decoration-none text-dark' replace>
                                        <p className='mb-3 bg-light border border-dark d-inline-block p-2 m-1 rounded theme theme-border' >{genre}</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`col-10 col-md-4 col-xl-6 border rounded mt-4 ${styles.cardplacement} ${styles.bordersection} ${styles.left}`}>
                    <h5 className={`mt-5 mb-5 ${styles.artisttitle}`}>Similar Artists</h5>
                        <div className="row d-flex justify-content-center" style={{ paddingLeft: "4%" }}>
                            {similar.map((name) => (
                                <div key={name.id} className="card m-3 p-0 theme theme-border" style={{ width: '13rem' }}>
                                    <Link href={`/artist/${name.id}`}>
                                        <Image className="card-img-top" loader={() => name.images ? name.images : '/images/person-circle.svg'} src={name.images ? name.images : '/images/play-fill-magenta.svg'} height={150} width={150} alt="Picture of the author" />
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{name.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div>

                    <h1 className={`mt-5 mb-5 ${styles.artisttitle}`}>Top Tracks</h1>
                    <div className='col-xl-12 mt-5 mb-5 d-flex justify-content-center'>
                        <ul>{topTracks.map((name) =>
                            <div key={name.id} className={`card col-10 mb-3 ${styles.artistwidth}`}>
                                <div className='row g-0 d-flex align-items-center theme theme-border'>
                                    <Image className='img-fluid rounded-start col-2' loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />
                                    <div className='col-8 card-body'>
                                        <Link className='theme' style={{ textDecoration: 'none' }} href={`/song/${name.id}`}>
                                            <h6 className='text-start card-title'>{name.name}</h6>
                                            <p className='text-start card-text text-muted theme'>
                                                {name.artist.join(', ')}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className='col-2 h-100 align-items-center'>
                                        <PreviewSong preview={name.preview} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
                                    </div>
                                </div>
                            </div>)}
                        </ul>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Artist
