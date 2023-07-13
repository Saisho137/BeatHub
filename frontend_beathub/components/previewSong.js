import { useState, useRef } from 'react'

export default function PreviewSong({ preview, isPlaying, setIsPlaying }) {

    const audioRef = useRef(null)

    if (audioRef.current && isPlaying != preview) {
        audioRef.current.pause()
    }

    const playPreview = () => {

        if (isPlaying == preview) {
            setIsPlaying(false)
            audioRef.current.pause()
        }
        else {
            setIsPlaying(preview)
            audioRef.current = new Audio(preview)
            audioRef.current.volume = 0.25
            audioRef.current.play()
        }
    }

    return (
        <button
            onClick={playPreview}
            className='rounded-circle border-0 align-middle pb-1'
            style={{ backgroundColor: `${preview ? '#9c439c' : 'grey'}` }}
            disabled={!preview}
        >
            {!isPlaying || isPlaying != preview
                ? <img src='/images/play-fill.svg' alt='play' />
                : <img src='/images/pause-fill.svg' alt='pause' />}
        </button>
    )
}

