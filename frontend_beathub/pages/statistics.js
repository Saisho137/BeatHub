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

    console.log(stats);
    if (!stats.user) {
        return <p>Loading</p>
    }

    return (
        <div className='container h-100'>
            <div className='card mb-3 col-md-4 align-middle'>
                <div className='row align-items-center h-100'>
                    <div className='col-md-4'>
                        <img src={stats.user?.images[0] ? stats.user.images[0].url : 'images/person-circle.svg'} className='img-fluid rounded-circle' alt='Bootstrap' />
                    </div>
                    <div className='col-md-8'>
                        <div class="card-body">
                            <h5 class="card-title">{stats.user.display_name}</h5>
                            <p>followers: {stats.user.followers.total}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}