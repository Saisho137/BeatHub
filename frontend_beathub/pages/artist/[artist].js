import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import Link from 'next/link'



const Artist = () => {
    const [artist, setArtist] = useState('')

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

    useEffect(() => {
        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificArtist(token)
        }
    }, [param])

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
                <div className={`row mb-5 justify-content-center`}>
                    <div className={`col-11 col-md-7 col-xl-4 ${styles.singleartist}`}>
                        <div className={`card theme theme-border`}>
                            <h3 className="card-title card-header theme-border" style={{ marginBottom: "2%" }}>{artist.name}</h3>
                            <div className="card-img">
                                <Link href='/recommender'>
                                    <Image className="rounded" loader={() => artist.images ? artist.images : '/images/person-circle.svg'} src={artist.images ? artist.images : '/images/person-circle.svg'} height={300} width={300} alt="Picture of the author" />
                                </Link>

                            </div>
                            {artist.genres.length > 0 && (
                                <>
                                    <h4 className='card-footer mt-3 theme-border'>Artist genres</h4>
                                    <div>
                                        {artist.genres.map((genre) =>
                                            <Link key={genre} href={`/genre/${genre}`} className='text-decoration-none text-dark' replace>
                                                <p className='mb-3 bg-light border border-dark d-inline-block p-2 m-1 rounded theme theme-border' >{genre}</p>
                                            </Link>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Artist
