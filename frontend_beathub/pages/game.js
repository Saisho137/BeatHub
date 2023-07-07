import { useEffect, useRef, useState } from "react"
import styles from '../styles/game.module.css'
import Layout from "../components/layout"
import { useRouter } from 'next/router'
import axios from "axios"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Game() {
    const [selectedOption, setSelectedOption] = useState({
        typeOfSearch: 'genre',
        difficultyLevel: 'easy',
        isOpen: false,
        isArtistChecked: 'artistTrue'
    })
    const [difficulty, setDifficulty] = useState({
        tries: 3,
        duration: 5,
        artist: true
    })
    const [isPlaying, setIsPlaying] = useState(false)
    const [response, setResponse] = useState({})
    const [winner, setWinner] = useState(null)
    const timeoutRef = useRef(null)
    const audioRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (!token) {
            router.push('/')
        }
    }, [])

    const handleSelectionChange = (event) => {
        setSelectedOption({ ...selectedOption, typeOfSearch: event.target.value })
    }
    const handleSelectionChangeDifficult = (event) => {
        setSelectedOption({ ...selectedOption, difficultyLevel: event.target.value })
    }
    const toggleSidebar = () => {
        setSelectedOption({ ...selectedOption, isOpen: !selectedOption.isOpen })
    }
    const handleCheckboxChange = (option) => {
        setSelectedOption({ ...selectedOption, isArtistChecked: option })
    }
    const listOfArtist = () => {
        const listOfArtist = response.artistName.map(name => (name.toString())).join(', ')
        return listOfArtist
    }
    const handleNotification = (condition, message) => {
        switch (condition) {
            case "success":
                toast.success(message, {
                    autoClose: 1500,
                    position: toast.POSITION.TOP_CENTER,
                    closeButton: true,
                    className: 'custom-toast',
                })
                break
            case "error":
                toast.error(message, {
                    autoClose: 1500,
                    position: toast.POSITION.TOP_CENTER,
                    closeButton: true,
                    className: 'custom-toast',
                })
                break
            case "warning":
                toast.warning(message, {
                    autoClose: 1500,
                    position: toast.POSITION.TOP_CENTER,
                    closeButton: true,
                    className: 'custom-toast',
                })
                break
            default:
                console.log("default")
        }
    }

    const startPlayback = () => {
        setIsPlaying(true)
        audioRef.current.volume = 0.33
        audioRef.current.play()

        timeoutRef.current = setTimeout(() => {
            setIsPlaying(false)
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }, difficulty.duration * 1000)
    }
    const stopPlayback = () => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
        setIsPlaying(false)
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        clearTimeout(timeoutRef.current)
        const songName = event.target.songName.value

        if (selectedOption.typeOfSearch == "artist" || !difficulty.artist) {
            if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())) {
                setWinner(true)
                setDifficulty({ ...difficulty, tries: 0 })
                handleNotification("success", "YOU WIN!!!")
            } else {
                if (difficulty.tries == 1) {
                    handleNotification("error", "YOU LOSE :(  |  try another song!")
                    setWinner(false)
                    setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                    event.target.reset()
                    return
                }
                setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                handleNotification("warning", "KEEP TRYING!")
            }
        } else {
            const artist = event.target.artistName.value
            if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())
                && response.artistName.map(name => (name.toLowerCase())).includes(artist.toLowerCase())) {
                setWinner(true)
                setDifficulty({ ...difficulty, tries: 0 })
                handleNotification("success", "YOU WIN!!!")
            } else {
                if (difficulty.tries == 1) {
                    handleNotification("error", "YOU LOSE :(  |  try another song!")
                    setWinner(false)
                    setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                    event.target.reset()
                    return
                }
                setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                handleNotification("warning", "KEEP TRYING!")
            }
        }
        event.target.reset()
    }
    const handleSubmitTrack = async (event) => {
        event.preventDefault()
        setWinner(null)
        document.getElementById('formGuess').reset()

        switch (selectedOption.difficultyLevel) {
            case "easy":
                setDifficulty({ tries: 5, duration: 20, artist: false })
                break
            case "normal":
                setDifficulty({ tries: 3, duration: 10, artist: true })
                break
            case "hard":
                setDifficulty({ tries: 1, duration: 5, artist: true })
                break
            case "custom":
                setDifficulty({ tries: event.target.tries.value, duration: event.target.duration.value, artist: selectedOption.isArtistChecked === "artistTrue" })
                break
            default:
                console.log("Default")
        }

        const token = sessionStorage.getItem('token')
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        switch (selectedOption.typeOfSearch) {
            case "genre":
                try {
                    const { data } = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption.typeOfSearch, searchItem: event.target.genre.value }, headers)
                    setResponse(data.Track)
                    break
                } catch (err) {
                    if (err.response && err.response.status == 401) {
                        sessionStorage.setItem('callback', 'game')
                        router.push('/callback')
                        return
                    }
                    handleNotification("warning", "Check your Genre and try again!")
                    return
                }
            case "playlist":
                try {
                    const playlist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption.typeOfSearch, searchItem: event.target.playlist.value }, headers)
                    setResponse(playlist.data.Track)
                    break
                } catch (err) {
                    if (err.response && err.response.status == 401) {
                        sessionStorage.setItem('callback', 'game')
                        router.push('/callback')
                        return
                    }
                    handleNotification("warning", "Check your Playlist and try again!")
                    return
                }
            case "artist":
                try {
                    const artist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption.typeOfSearch, searchItem: event.target.artist.value }, headers)
                    setResponse(artist.data.Track)
                    break
                } catch (err) {
                    if (err.response && err.response.status == 401) {
                        sessionStorage.setItem('callback', 'game')
                        router.push('/callback')
                        return
                    }
                    handleNotification("warning", "Check your Artist and try again!")
                    return
                }
            default:
                console.log("Default")
        }
        if (response.preview) {
            stopPlayback()
        }
    }

    return (
        <Layout>
            <button className={`${styles['toggle-sidebar-button']}`} onClick={toggleSidebar}>
                <b>{selectedOption.isOpen ? "<" : ">"}</b>
            </button>
            <div className={`col-12 row ${styles.body}`}>
                <div style={{ left: selectedOption.isOpen ? '-3%' : '-100%' }} className={`col-xl-6 ${styles['sidebar-column']} border border-success border-3 rounded p-5`}>
                    <div className={`row d-flex justify-content-center mt-4`}>
                        <h1 className={`row col-12 d-flex justify-content-center mb-5 ${styles['instructions-tittle']}`}>Build your Game</h1>
                        <form className="row col-12 d-flex justify-content-center" onSubmit={handleSubmitTrack}>
                            <label className="col-xl-3 mt-3" htmlFor="typeOfSearch"><b>Select Type of Search:</b></label>
                            <select className={`col-xl-7 mt-3 ${styles['input-combobox']}`} id="typeOfSearch" value={selectedOption.typeOfSearch} onChange={handleSelectionChange}>
                                <option value="genre">Genre</option>
                                <option value="playlist">Playlist</option>
                                <option value="artist">Artist</option>
                            </select>
                            {selectedOption.typeOfSearch == "genre" && <>
                                <label className="col-xl-4 mt-2" htmlFor="genre"><b>Genre:</b></label>
                                <input className={`col-xl-6 mt-2 ${styles.input}`} type="text" id="genre" name="genre" required />
                            </>}
                            {selectedOption.typeOfSearch == "playlist" && <>
                                <label className="col-xl-4 mt-2" htmlFor="playlist"><b>Playlist:</b></label>
                                <input className={`col-xl-6 mt-2 ${styles.input}`} type="text" id="playlist" name="playlist" required />
                            </>}
                            {selectedOption.typeOfSearch == "artist" && <>
                                <label className="col-xl-4 mt-2" htmlFor="artist"><b>Artist:</b></label>
                                <input className={`col-xl-6 mt-2 ${styles.input}`} type="text" id="artist" name="artist" required />
                            </>}
                            <label className="col-xl-3 mt-2" htmlFor="difficultyLevel"><b>Select difficulty:</b></label>
                            <select className={`col-xl-7 mt-2 ${styles['input-combobox']}`} id="difficultyLevel" value={selectedOption.difficultyLevel} onChange={handleSelectionChangeDifficult}>
                                <option value="easy">Easy</option>
                                <option value="normal">Normal</option>
                                <option value="hard">Hard</option>
                                <option value="custom">Custom</option>
                            </select>
                            {selectedOption.difficultyLevel == 'custom' && <>
                                <label className="col-xl-4 mt-2" htmlFor="duration"><b>Preview duration (secs):</b></label>
                                <input className={`col-xl-6 mt-2 ${styles.input}`} type="number" id="duration" name="duration" max={29} min={1} required />
                                <label className="col-xl-4 mt-2" htmlFor="tries"><b>Number of Tries:</b></label>
                                <input className={`col-xl-6 mt-2 ${styles.input}`} type="number" id="tries" name="tries" max={99} min={1} required />
                                {selectedOption.typeOfSearch != "artist" && <>
                                    <label className="col-xl-4 mt-2"><b>Include artist name: </b></label>
                                    <label className="col-xl-1 mt-2" htmlFor="artistTrue"><b>Yes</b></label>
                                    <input className={`col-xl-1 mt-2 ${styles['input-checkbox']}`} type="checkbox" id="artistTrue" name="artistTrue"
                                        checked={selectedOption.isArtistChecked === 'artistTrue'} onChange={() => handleCheckboxChange('artistTrue')} />
                                    <label className="col-xl-1 mt-2" htmlFor="artistFalse"><b>No</b></label>
                                    <input className={`col-xl-1 mt-2 ${styles['input-checkbox2']}`} type="checkbox" id="artistFalse" name="artistFalse"
                                        checked={selectedOption.isArtistChecked === 'artistFalse'} onChange={() => handleCheckboxChange('artistFalse')} />
                                    <div className="col-xl-2 mt-2"></div>
                                </>}
                            </>}
                            <button className={`col-4 ${styles['input-button']} my-5`} type="submit">Find</button>
                        </form>
                    </div>
                </div>
                <div className="row col-xl-6 d-flex justify-content-center align-self-center my-5 px-5">
                    <h1 className={`col-xl-8 d-flex justify-content-center mb-3 ${styles['instructions-tittle']}`}>How to play Guess Game?</h1>
                    <h4 className={`col-xl-8 d-flex justify-content-center ${styles['instructions-text']}`}>
                        First you must generate a random song and then guess which is it, you need to open the sidebar with the top left button,
                        choose between genre, playlist or artist and fill in the information, then you must press the ¨find¨ button and a song will be generated on the
                        right side of the page, with a certain duration, number of attempts and if you chose it, the option to also guess the artist. Now you should listen
                        to the mystery track and fill in the song name and artist name fields (if you have it), finally, press the ¨guess¨ button to see if your guess
                        is correct. Good luck!
                    </h4>
                </div>
                <div className={`${styles['main-column']} row col-xl-6 mt-4 d-flex justify-content-center align-self-center`}>
                    <ToastContainer />
                    <form className="row col-12 align-self-center border border-dark border-2 rounded-5 p-4" id="formGuess" onSubmit={handleSubmit}>
                        <div className="row col-xl-6 d-flex align-self-center">
                            <label className={`col-xl-8 mt-3`} htmlFor="songName"><h4><b>Song Name:</b></h4></label>
                            <input className={`col-xl-10 mt-3 ${styles.input}`} disabled={!response.name || winner != null} type="text" id="songName" name="songName" required />
                            {selectedOption.typeOfSearch != "artist" && difficulty.artist ? <>
                                <label className="col-xl-8 mt-3"><h4><b>Artist Name:</b></h4></label>
                                <input className={`col-xl-10 ${styles.input} mt-3 mb-4`} disabled={!response.name || winner != null} type="text" id="artistName" name="artistName" required />
                            </> : <><div className="col-xl-12 my-1"></div><div className="col-xl-12 my-3"></div></>}
                        </div>
                        <div className="row col-xl-6 d-flex justify-content-center align-self-center">
                            {response.name && <h2 className="col-8 d-flex justify-content-center my-3"><b>Tries: {difficulty.tries}</b></h2>}
                            {!response.name && <h4 className="col-8 d-flex justify-content-center my-3"><b>Find a song to Start!</b></h4>}
                            <button className={`col-6 ${styles['input-button']} my-3`} disabled={!response.name || winner != null} type="submit">Guess!</button>
                        </div>
                    </form>
                    <div className="row col-12 align-self-center">
                        {response.name && winner && <>
                            <div className="row d-flex justify-content-center mt-3">
                                <div className={`card col-xl-10 ${styles['preview-song']}`}>
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src={response.image} alt="Picture of album from artist"></img>
                                            <div className="row col-xl-8">
                                                <h4 className="card-title col-12">{response.name}</h4>
                                                <h5 className="card-text col-12">{listOfArtist()}</h5>
                                                <audio className="col-12" controls src={response.preview}></audio>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                        {response.name && !winner && difficulty.tries == 0 && <>
                            <div className="row d-flex justify-content-center mt-3">
                                <h2>It actually was:</h2>
                                <div className={`card col-xl-10 ${styles['preview-song']}`}>
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src={response.image} alt="Picture of album from artist"></img>
                                            <div className={`row col-xl-8`}>
                                                <h4 className="card-title col-12">{response.name}</h4>
                                                <h5 className="card-text col-12">{listOfArtist()}</h5>
                                                <audio className="col-12" controls src={response.preview}></audio>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                        {response.name && !winner && difficulty.tries > 0 &&
                            (<div className="row d-flex justify-content-center mt-3">
                                <audio ref={audioRef} src={response.preview}></audio>
                                <div className={`card col-xl-10 ${styles['preview-song']}`}>
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src="/images/question.JPG" alt="Picture of album from artist"></img>
                                            <div className="row col-xl-8">
                                                <h4 className="card-title col-12">????????</h4>
                                                <h5 className="card-text col-12">????</h5>
                                                {!isPlaying && <button className={`col-4 align-self-start ${styles['input-button']}`} onClick={startPlayback}>Play</button>}
                                                {isPlaying && <button className={`col-4 align-self-start ${styles['input-button']}`} onClick={stopPlayback}>Stop</button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </Layout>
    )
}