import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from "../../components/layout"
import SpotifyEmbed from '../../components/spotifyEmbed'
import BackLink from '../../components/backLink'
import PageLoader from '../../components/pageLoader'
import StatTile from '../../components/statTile'
import statisticsStyles from '../../styles/statistics.module.css'
import Link from 'next/link'
import { yearOf } from '../../lib/format'

function ReleaseGrid({ title, releases }) {
    if (releases.length === 0) return null
    return (
        <>
            <h3 className={statisticsStyles.sectionTitle}>{title}</h3>
            <div className='row justify-content-center'>
                {releases.map(release =>
                    <div key={release.id} className='col-6 col-md-4 col-lg-3 col-xl-2 mb-3'>
                        <Link href={`/album/${release.id}`} className='card h-100 text-decoration-none theme theme-border'>
                            {release.image && <img src={release.image} className='card-img-top' alt='' />}
                            <div className='card-body p-3 text-start'>
                                <h6 className='card-title mb-1'>{release.name}</h6>
                                <p className={`small mb-0 ${statisticsStyles.muted}`}>
                                    {yearOf(release.releaseDate)} · {release.totalTracks} {release.totalTracks === 1 ? 'track' : 'tracks'}
                                </p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

const Artist = () => {
    const [artist, setArtist] = useState('')
    const [discography, setDiscography] = useState(null)

    const router = useRouter()
    const param = router.query.artist

    const redirectToLogin = () => {
        sessionStorage.setItem('callback', `artist/${param}`)
        router.push('/callback')
    }

    useEffect(() => {
        if (!param) return
        const headers = { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        setArtist('')
        setDiscography(null)

        axios.get(`/api/artist/getSpecificArtist/${param}`, headers)
            .then(({ data }) => setArtist(data.getSpecificArtist))
            .catch(error => {
                if (error.response && error.response.status == 401) redirectToLogin()
            })

        axios.get(`/api/artist/getArtistAlbums/${param}`, headers)
            .then(({ data }) => setDiscography(data))
            .catch(error => {
                if (error.response && error.response.status == 401) return redirectToLogin()
                setDiscography({ releases: [], failed: true })
            })
    }, [param])

    if (!artist) {
        return <PageLoader />
    }

    const releases = discography?.releases ?? []
    const albums = releases.filter(release => release.type === 'album')
    const singles = releases.filter(release => release.type === 'single')
    const years = releases.map(release => yearOf(release.releaseDate)).filter(Boolean)

    return (
        <Layout>
            <div className={`container py-4 py-lg-5 text-center ${statisticsStyles.page}`}>
                <div className='text-start'><BackLink /></div>

                <div className='d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mt-3'>
                    <img src={artist.images || '/images/person-circle.svg'}
                        className='rounded-circle'
                        style={{ width: '120px', height: '120px', objectFit: 'cover', boxShadow: 'var(--shadow)' }}
                        alt='' />
                    <div className='text-center text-sm-start'>
                        <p className='text-muted small text-uppercase fw-semibold mb-1'>Artist</p>
                        <h1 className='mb-0'>{artist.name}</h1>
                    </div>
                </div>

                <div className='row justify-content-center mt-4'>
                    <div className='col-12 col-lg-8'>
                        <SpotifyEmbed type='artist' id={param} height={352} />
                    </div>
                </div>

                {discography === null ? (
                    <div className='d-flex justify-content-center p-5'>
                        <div className='spinner-border' role='status' style={{ color: 'var(--brand)' }}><span className='visually-hidden'>Loading discography</span></div>
                    </div>
                ) : discography.failed ? (
                    <p className={`mt-4 ${statisticsStyles.muted}`}>Sorry! Could not load the discography of this artist.</p>
                ) : releases.length > 0 && (
                    <>
                        <div className='row justify-content-center mt-4'>
                            <StatTile label='albums' value={albums.length} />
                            <StatTile label='singles & EPs' value={singles.length} />
                            <StatTile label='active since' value={Math.min(...years)} />
                            <StatTile label='latest release' value={Math.max(...years)} />
                        </div>
                        <ReleaseGrid title='Albums' releases={albums} />
                        <ReleaseGrid title='Singles & EPs' releases={singles} />
                        {discography.truncated && (
                            <p className={`small mt-3 ${statisticsStyles.muted}`}>
                                Showing the latest releases only: this artist has more than 200.
                            </p>
                        )}
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Artist
