import { useState, useRef } from 'react'

export default function PreviewSong({ preview }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    const playPreview = () => {
        if (!isPlaying) {
            audioRef.current = new Audio(preview)
            audioRef.current.volume = 0.25
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <button onClick={playPreview} className='rounded-circle border-0 align-middle pb-1' style={{ backgroundColor: 'lightgreen' }}>
            {!isPlaying
                ? <img src='/images/play-fill.svg' alt='play'/>
                : <img src='/images/pause-fill.svg' alt='pause'/>}
        </button>
    )
}