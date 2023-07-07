import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import PreviewSong from '../../components/previewSong'
import Link from 'next/link'

const Songs = () => {

    const router = useRouter()
    const param = router.query.songs

    const [song, setSong] = useState('')
    const [similar, setSimilar] = useState([])

    const getSpecificTrack = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`http://localhost:8080/getSpecificTrack/${param}`, headers)
            setSong(data.getTrack)
            getSimilarTracks(token, data.getTrack)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `song/${param}`)
                router.push('/callback')
                return
            }
        }

    }

    const getSimilarTracks = async (token, song) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`http://localhost:8080/getSimilarTracks/${song.artistId}/${song.songId}`, headers)
        setSimilar(data.getSimilarTrack)
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

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 border'>
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
                <h1 className={`${styles.artisttitle}`}>Songs</h1>
                <div className={`row mb-5`}>
                    <div className={`col-11 col-md-7 col-xl-5 ${styles.singleartist}`}>
                        <div className={`card ${styles.artistmargin}`}>
                            <h3 className="card-title card-header" style={{ marginBottom: "2%" }}>{song.name}</h3>
                            <div className="card-img">
                                <Link href={`/artist/${song.artistId}`}>
                                    <Image className="rounded" loader={() => song.images ? song.images : '/images/person-circle.svg'} src={song.images ? song.images[0] : '/images/person-circle.svg'} height={300} width={300} alt="Picture of the author" />
                                </Link>
                            </div>
                            <h4 className='card-footer mt-3'>Artist</h4>
                            <div>
                                <p>{song.artistName}</p>
                            </div>
                        </div>
                    </div>


                    <div className={`col-10 col-md-5 col-xl-5 border-start mt-4 ${styles.cardplacement} ${styles.bordersection} ${styles.left}`}>
                        <h5 className={`mt-5 mb-5 ${styles.artisttitle}`}>Similar Songs</h5>
                        <div className='d-flex justify-content-center'>
                            <ul>{similar.map((name) =>
                                <div key={name.id} className='card col-11 mb-3 ms-2'>
                                    <div className='row g-0 d-flex align-items-center'>
                                        <Image className='img-fluid rounded-start col-2' loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />
                                        <div className='col-8 card-body'>
                                            <Link style={{ textDecoration: 'none' }} href={`/song/${name.id}`}>
                                                <h6 className='text-start card-title'>{name.name}</h6>
                                                <p key={name} className='text-start card-text text-muted'>{name.artist.join(', ')}</p>
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
            </div>
        </Layout>
    )
}

export default Songs
