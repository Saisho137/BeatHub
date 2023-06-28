import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import PreviewSong from '../../components/previewSong';



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
                console.log("lol")
            }
        }
    }, [param]);

    if (!artist && !topTracks.length) {
        return <h1>Loading...</h1>
    }

    return (
        <Layout>
            <div className='row text-center offset-1 col-10 mt-5 pt-5 border'>
                <h1 className={`${styles.artisttitle}`}>Artist</h1>
                <div className={`row`}>
                    <div className={`col-12 col-md-10 col-xl-5 ${styles.singleartist}`}>
                        <div className={`card ${styles.artistmargin}`}>
                            <h3 className="card-title card-header" style={{ marginBottom: "2%" }}>{artist.name}</h3>
                            <div className="card-img">
                                <Image className="rounded" loader={() => artist.images} src={artist.images} height={300} width={300} alt="Picture of the author" />
                            </div>
                            <h4 className='card-footer'>Artist genres</h4>
                            {artist.genres.map((genres) => <p>{genres}</p>)}
                        </div>
                    </div>

                    <div className={`col-12 col-md-10 col-xl-7 border-start ${styles.cardplacement} ${styles.bordersection}`}>
                        <div className="row" style={{ paddingLeft: "4%" }}>
                            {similar.map((name) => (
                                <div className="card m-3 p-0" style={{ width: '13rem' }}>
                                    <Image className="card-img-top" loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />
                                    <div className="card-body">
                                        <h5 className="card-title">{name.name}</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div>

                    <div className="col-12 col-md-10 col-xl-7">
                        <ul>{topTracks.map((name) =>
                            <div className='card' style={{ display: 'flex', alignItems: 'center' }}>
                                <Image className='card-img-overlay h-100' loader={() => name.images} src={name.images} height={150} width={150} alt="Picture of the author" />
                                <p>{name.name}</p>
                                <p>{name.artist}</p>
                                <div>
                                    <PreviewSong preview={name.preview}/>
                                </div>
                            </div>)}
                        </ul>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Artist;
