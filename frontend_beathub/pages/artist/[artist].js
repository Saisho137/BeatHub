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

    const getArtistTopTracks = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`http://localhost:8080/getArtistTopTracks/${param}`, headers)
        setTopTracks(data.getArtistTopTracks)
    }


    useEffect(() => {

        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificArtist(token)
            getSimilarArtist(token)
            getArtistTopTracks(token)
            if (!token) {
                router.push('/')
            }
        }
    }, [param])

    if (!artist) {
        return <h1>Loading...</h1>
    }

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 border'>
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
                <h1 className={`${styles.artisttitle}`}>Artist</h1>
                <div className={`row mb-5`}>
                    <div className={`col-12 col-md-6 col-xl-5 ${styles.singleartist}`}>
                        <div className={`card ${styles.artistmargin}`}>
                            <h3 className="card-title card-header" style={{ marginBottom: "2%" }}>{artist.name}</h3>
                            <div className="card-img">
                                <Link href='/recommender'>
                                    <Image className="rounded" loader={() => artist.images ? artist.images : '/images/person-circle.svg'} src={artist.images ? artist.images : '/images/person-circle.svg'} height={300} width={300} alt="Picture of the author" />
                                </Link>

                            </div>
                            <h4 className='card-footer mt-3'>Artist genres</h4>
                            <div>
                                {artist.genres.map((genre) =>
                                    <Link key={genre} href={`/genre/${genre}`} className='text-decoration-none text-dark' replace>
                                        <p className='bg-light border border-dark d-inline-block p-2 m-1 rounded' >{genre}</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`col-10 col-md-4 col-xl-5 border-start mt-4 ${styles.cardplacement} ${styles.bordersection} ${styles.left}`}>
                        <div className="row" style={{ paddingLeft: "4%" }}>
                            {similar.map((name) => (
                                <div key={name.id} className="card m-3 p-0" style={{ width: '13rem' }}>
                                    <Link href={`/artist/${name.id}`}>
                                        <Image className="card-img-top" loader={() => name.images ? name.images : '/images/person-circle.svg'} src={name.images ? name.images : '/images/play-fill.svg'} height={150} width={150} alt="Picture of the author" />
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
                            <div key={name.id} className='card col-10 mb-3'>
                                <div className='row g-0 d-flex align-items-center'>
                                    <Image className='img-fluid rounded-start col-2' loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />
                                    <div className='col-8 card-body'>
                                        <Link style={{ textDecoration: 'none' }} href={`/song/${name.id}`}>
                                            <h6 className='text-start card-title'>{name.name}</h6>
                                            <p className='text-start card-text text-muted'>
                                                {name.artist.join(', ')}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className='col-2 h-100 align-items-center'>
                                        <PreviewSong preview={name.preview} />
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
