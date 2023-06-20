import Layout from '../components/layout'
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
                    <div class="card-body">
                        <h5 className="card-title">{stats.tracks[0].name}</h5>
                    </div>
                </div>
                <div className='col-md-3 card text-center border-0'>
                    <h5>Top Genre(s)</h5>
                    {stats.genres
                        .filter(genre => genre[1] === Math.max(...stats.genres.map(genre => genre[1])))
                        .map(genre => <h6>{genre[0]}</h6>)}
                </div>
                <div className='col-md-3 card text-center border-0'>
                    <h5>Top Artist</h5>
                    <img src={stats.artists[0]?.images.url} alt='Artist Picture' />
                    <div class="card-body">
                        <h5 className="card-title">{stats.artists[0].name}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}