import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import Link from 'next/link'

const Songs = () => {

    const router = useRouter()
    const param = router.query.songs

    const [song, setSong] = useState('')

    const getSpecificTrack = async (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await axios.get(`/api/song/getSpecificTrack/${param}`, headers)
            setSong(data.getTrack)
        }
        catch (error) {
            if (error.response && error.response.status == 401) {
                sessionStorage.setItem('callback', `song/${param}`)
                router.push('/callback')
                return
            }
        }

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
                <Link href='/recommender' className='m-3 col-2 p-1 btn btn-success main-color main-border'>
                    <img src='/images/arrow-up-circle-fill-white.svg' className='float-start ms-2 mt-1' style={{ transform: 'rotate(270deg)' }} />
                    Search More
                </Link>
                <h1 className={`${styles.artisttitle}`}>Songs</h1>
                <div className={`row mb-5 justify-content-center`}>
                    <div className={`col-11 col-md-7 col-xl-5 ${styles.singleartist}`}>
                        <div className={`card theme theme-border`}>
                            <h3 className="card-title card-header theme-border" style={{ marginBottom: "2%" }}>{song.name}</h3>
                            <div className="card-img">
                                <Image className="rounded" loader={() => song.images ? song.images : '/images/person-circle.svg'} src={song.images ? song.images[0] : '/images/person-circle.svg'} height={300} width={300} alt="Picture of the author" />
                            </div>
                            <div>
                                <h4 className='card-footer mt-3 theme-border'>Artist</h4>
                                {song.artistId.map((id, index) => (
                                    <Link key={id} href={`/artist/${id}`} className='text-decoration-none text-dark' replace>
                                        <p className='mb-3 bg-light border border-dark d-inline-block p-2 m-1 rounded theme theme-border'>
                                            {song.artistName[index]}
                                        </p>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Songs
