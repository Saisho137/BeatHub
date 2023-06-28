import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from "../../styles/artist.module.css"
import Layout from "../../components/layout"
import PreviewSong from '../../components/previewSong';
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
        const { data } = await axios.get(`http://localhost:8080/getSpecificTrack/${param}`, headers)
        setSong(data.getTrack)
    }

    useEffect(() => {
        if (param) {
            const token = sessionStorage.getItem('token')
            getSpecificTrack(token)
            if (!token) {
                console.log("lol")
            }
        }
    }, [param]);

    return (
        <div>
            {song.name}
        </div>
    );
}

export default Songs;
