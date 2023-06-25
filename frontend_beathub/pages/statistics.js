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
        <>

            <div className='row justify-content-center'>
                <button className='col-md-2' onClick={() => setTime('short_term')}>4 Weeks</button>
                <button className='col-md-2' onClick={() => setTime('medium_term')}>6 Months</button>
                <button className='col-md-2' onClick={() => setTime('long_term')}>All Time</button>
            </div>

            <div className='row'>
                {/* User's Profile */}
                <div className='card mb-3 col-md-4 offset-md-1 align-middle'>
                    <div className='row align-items-center h-100'>
                        <div className='col-md-4'>
                            <img src={stats.user?.images[0] ? stats.user.images[0].url : 'images/person-circle.svg'}
                                className='img-fluid rounded-circle'
                                alt='User Profile Picture'
                            />
                        </div>
                        <div className='col-md-8'>
                            <div className="card-body">
                                <h5 className='card-title'>{stats.user.display_name}</h5>
                                <p className='card-text'>followers: {stats.user.followers.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User's Top Items */}
                <div className='col-md-7 row'>
                    <div className='col-md-3 offset-md-1 card text-center border-0'>
                        <h5>Top Track</h5>
                        <img src={stats.tracks[0]?.images.url} alt='Artist Picture' />
                        <div className="card-body">
                            <h5 className="card-title">{stats.tracks[0].name}</h5>
                        </div>
                    </div>
                    <div className='col-md-3 card text-center border-0'>
                        <h5>Top Genre(s)</h5>
                        {stats.genres
                            .filter(genre => genre[1] === Math.max(...stats.genres.map(genre => genre[1])))
                            .map(genre => <h6 key={genre[0]}>{genre[0]}</h6>)}
                    </div>
                    <div className='col-md-3 card text-center border-0'>
                        <h5>Top Artist</h5>
                        <img src={stats.artists[0]?.images.url} alt='Artist Picture' />
                        <div className="card-body">
                            <h5 className="card-title">{stats.artists[0].name}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top songs features average */}
            <div className='row text-center'>
                <h1>Top songs analysis</h1>
                {Object.entries(stats.features).map(([name, value]) => <FeatureBar key={name} name={name} value={value} />)}
            </div>

            {/* Top songs list */}
            <div className='row'>
                <h1 className='text-center'>Top Songs</h1>
                {stats.tracks.map(track =>
                    <div className='card offset-md-1 align-middle'>
                        <div className='row'>
                            <div className='col-md-1'>
                                <img src={track.images.url} className='card-img' />
                            </div>
                            <div className='col-md-10'>
                                <div className='card-header'>{track.name}</div>
                                <p>{track.artists.toString()}</p>
                            </div>
                        </div>
                    </div>)}
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
                </div> )}
            </div>
        </>
    )
}