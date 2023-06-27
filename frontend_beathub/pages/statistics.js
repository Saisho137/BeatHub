import '../styles/statistics.module.css'
import Layout from '../components/layout'
import FeatureBar from '../components/featureBar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Image } from 'next/image'

export default function Statistics() {

    async function getStats(token) {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        const { data } = await axios.get(`http://localhost:8080/stats/${time}`, headers)
        setStats(data)
    }

    const router = useRouter()
    const [time, setTime] = useState('short_term')
    const [stats, setStats] = useState('')

    useEffect(() => {
        const token = sessionStorage.getItem('token')

        if (!token) {
            router.push('/')
        }

        setStats(getStats(token))

    }, [time])

    if (!stats.user) {
        return <p>Loading</p>
    }

    console.log(stats)

    return (
        <Layout>

            <h1 className='text-center mt-5'>Statistics</h1>

            <div className='row justify-content-center offset-1 col-10 mt-5'>
                <button
                    className={`col-md-4 rounded rounded-pill border-dark text-bg-${time == 'short_term' ? 'dark' : 'light'}`}
                    onClick={() => setTime('short_term')}>4 Weeks</button>
                <button
                    className={`col-md-4 rounded rounded-pill border-dark text-bg-${time == 'medium_term' ? 'dark' : 'light'}`}
                    onClick={() => setTime('medium_term')}>6 Months</button>
                <button
                    className={`col-md-4 rounded rounded-pill border-dark text-bg-${time == 'long_term' ? 'dark' : 'light'}`}
                    onClick={() => setTime('long_term')}>All Time</button>
            </div>

            <div className='row'>
                {/* User's Profile */}
                <div className='card col-md-4 offset-md-1 align-middle text-bg-light mb-5 border-dark mt-5'>
                    <div className='row align-items-center h-100'>
                        <div className='col-md-4 h-50'>
                            <img src={stats.user?.images[0] ? stats.user.images[0].url : 'images/person-circle.svg'}
                                className='img-fluid rounded-circle h-100 border border-dark'
                                alt='User Profile Picture'
                            />
                        </div>
                        <div className='col-md-8'>
                            <div className="card-body">
                                <h1 className='card-title'>{stats.user.display_name}</h1>
                                <p className='card-text'>followers: {stats.user.followers.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User's Top Items */}
                <div className='col-md-6 card-group mt-5 mb-5'>
                    <div className='col-md-3 offset-md-1 card text-center text-bg-light border-dark'>
                        <h4 className='card-header'>Top Track</h4>
                        <img src={stats.tracks[0]?.images.url}
                            alt='Artist Picture'
                            className='rounded-circle p-1 mx-auto d-block'
                            style={{ width: '75%' }} />
                        <div className="card-footer">
                            <h5 className="card-title">{stats.tracks[0].name}</h5>
                        </div>
                    </div>
                    <div className='col-md-3 card text-bg-light border-dark d-block'>
                        <h4 className='card-header text-center'>Top Genre(s)</h4>
                        {stats.genres
                            .filter(genre => genre[1] === Math.max(...stats.genres.map(genre => genre[1])))
                            .map(genre => <p key={genre[0]} className='bg-light border border-dark d-inline-block p-2 m-1 rounded' >{genre[0]}</p>)}
                    </div>
                    <div className='col-md-3 card text-center text-bg-light border-dark'>
                        <h4 className='card-header'>Top Artist</h4>
                        <img src={stats.artists[0]?.images.url}
                            alt='Artist Picture'
                            className='rounded-circle p-1 mx-auto d-block'
                            style={{ width: '75%' }} />
                        <div className="card-footer">
                            <h5 className="card-title">{stats.artists[0].name}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top songs features average */}
            <div className='row text-center border pt-5'>
                <h1>Top songs analysis</h1>
                <div className='offset-1 col-10 row mt-5'>
                    {Object.entries(stats.features).map(([name, value]) => <FeatureBar key={name} name={name} value={value} />)}
                </div>
            </div>

            {/* Top songs list */}
            <div className='row text-center border pt-5'>
                <h1 className='pb-5'>Top Songs</h1>
                <div className='offset-1 col-10 row justify-content-center'>
                    {stats.tracks.map(track =>
                        <div className='card col-md-2 m-2 p-0'>
                            <img src={track.images.url} className='card-img-top' alt='Album image' />
                            <div className='card-body'>
                                <h6 className='card-title'>{track.name}</h6>
                            </div>
                            <div className='card-footer'>
                                <p className='text-muted'>{track.artists.toString()}</p>
                            </div>
                        </div>)}
                </div>
            </div>

            {/* Top genres list */}
            <div className='row text-center'>
                <h1>Top Genres</h1>
                <ul>
                    {stats.genres.map(([name, value]) => <li key={name}>{name}: {value}</li>)}
                </ul>
            </div>

            <div className='row'>
                <h1 className='text-center'>Top Artists</h1>
                {stats.artists.map(artist =>
                    <div className='card offset-md-1 align-middle'>
                        <div className='row'>
                            <div className='col-md-1'>
                                <img src={artist.images ? artist.images.url : 'images/person-circle.svg'} className='card-img' />
                            </div>
                            <div className='col-md-10'>
                                <p>{artist.name}</p>
                            </div>
                        </div>
                    </div>)}
            </div>
        </Layout>
    )
}