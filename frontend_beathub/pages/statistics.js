import Layout from '../components/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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

        if(!token) {
            router.push('/')
        }

        setStats(getStats(token))

    }, [time])

    console.log(stats);
    if (!stats) {
        return <p>Loading</p>
    }

    return (
        <div className='container'>
            <div className='row'>
                <p>Stats works!</p>
            </div>
        </div>
    )
}