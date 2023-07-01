import Layout from "../components/layout"
import { useRef, useState } from "react"
import axios from "axios"
import styles from '../styles/game.module.css'

export default function Game() {
    const [selectedOption, setSelectedOption] = useState({
        typeOfSearch: 'genre',
        difficultyLevel: 'easy',
        isOpen: false
    })
    const [difficulty, setDifficulty] = useState({
        tries: 3,
        duration: 5,
        artist: true
    })
    const [isPlaying, setIsPlaying] = useState(false)
    const [response, setResponse] = useState({})
    const [winner, setWinner] = useState(false)
    const timeoutRef = useRef(null)
    const audioRef = useRef(null)
    const formRef = useRef(null)

    const listOfArtist = () => {
        const listOfArtist = response.artistName.map(name => (name.toString())).join(', ')
        return listOfArtist
    }

    const handleSelectionChange = (event) => {
        setSelectedOption({ ...selectedOption, typeOfSearch: event.target.value })
    }

    const handleSelectionChangeDifficult = (event) => {
        setSelectedOption({ ...selectedOption, difficultyLevel: event.target.value })
    }

    const toggleSidebar = () => {
        setSelectedOption({ ...selectedOption, isOpen: !selectedOption.isOpen })
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

        if (winner) {
            alert("YOU ALREADY WON!")
            return
        }
        if (selectedOption.typeOfSearch == "artist" || !difficulty.artist) {
            if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())) {
                if (difficulty.tries == 0) {
                    alert("YOU LOSE :( - try another song!")
                    return
                }
                setWinner(true)
                setDifficulty({ ...difficulty, tries: 0 })
                alert("YOU WIN!!!")
            } else {
                setWinner(false)
                if (difficulty.tries == 0) {
                    alert("YOU LOSE :( - try another song!")
                    return
                }
                setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                alert("KEEP TRYING!")
            }
        } else {
            const artist = event.target.artistName.value
            if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())
                && response.artistName.map(name => (name.toLowerCase())).includes(artist.toLowerCase())) {
                if (difficulty.tries == 0) {
                    alert("YOU LOSE :( - try another song!")
                    return
                }
                setWinner(true)
                setDifficulty({ ...difficulty, tries: 0 })
                alert("YOU WIN!!!")
            } else {
                setWinner(false)
                if (difficulty.tries == 0) {
                    alert("YOU LOSE :( - try another song!")
                    return
                }
                setDifficulty({ ...difficulty, tries: difficulty.tries - 1 })
                alert("KEEP TRYING!")
            }
        }
        event.target.reset()
    }

    const handleSubmitTrack = async (event) => {
        event.preventDefault()
        setWinner(false)
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
                setDifficulty({ tries: event.target.tries.value, duration: event.target.duration.value, artist: event.target.artistChecked.checked })
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
                    alert("Check your genre and try again!")
                    return
                }
            case "playlist":
                try {
                    const playlist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption.typeOfSearch, searchItem: event.target.playlist.value }, headers)
                    setResponse(playlist.data.Track)
                    break
                } catch (err) {
                    alert("Check your playlist and try again!")
                    return
                }
            case "artist":
                try {
                    const artist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption.typeOfSearch, searchItem: event.target.artist.value }, headers)
                    setResponse(artist.data.Track)
                    break
                } catch (err) {
                    alert("Check your artist and try again!")
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
            <div className={`row`}>
                {selectedOption.isOpen && (
                    <div className={`col-xl-6 ${styles['sidebar-column']} border`}>
                        <div className={`${styles.sidebar} row d-flex justify-content-center mt-4`}>
                            <h2 className="row col-12 d-flex justify-content-center">Build your Game</h2>
                            <form className="row col-12 d-flex justify-content-center" onSubmit={handleSubmitTrack}>
                                <label className="col-xl-3 mt-3" htmlFor="typeOfSearch"><b>Select Type of Search:</b></label>
                                <select className="col-xl-7 mt-3" id="typeOfSearch" value={selectedOption.typeOfSearch} onChange={handleSelectionChange}>
                                    <option value="genre">Genre</option>
                                    <option value="playlist">Playlist</option>
                                    <option value="artist">Artist</option>
                                </select>
                                {selectedOption.typeOfSearch == "genre" && <>
                                    <label className="col-xl-4 mt-2" htmlFor="genre"><b>Genre:</b></label>
                                    <input className="col-xl-6 mt-2" type="text" id="genre" name="genre" required />
                                </>}
                                {selectedOption.typeOfSearch == "playlist" && <>
                                    <label className="col-xl-4 mt-2" htmlFor="playlist"><b>Playlist:</b></label>
                                    <input className="col-xl-6 mt-2" type="text" id="playlist" name="playlist" required />
                                </>}
                                {selectedOption.typeOfSearch == "artist" && <>
                                    <label className="col-xl-4 mt-2" htmlFor="artist"><b>Artist:</b></label>
                                    <input className="col-xl-6 mt-2" type="text" id="artist" name="artist" required />
                                </>}
                                <label className="col-xl-3 mt-2" htmlFor="difficultyLevel"><b>Select difficulty:</b></label>
                                <select className="col-xl-7 mt-2" id="difficultyLevel" value={selectedOption.difficultyLevel} onChange={handleSelectionChangeDifficult}>
                                    <option value="easy">Easy</option>
                                    <option value="normal">Normal</option>
                                    <option value="hard">Hard</option>
                                    <option value="custom">Custom</option>
                                </select>
                                {selectedOption.difficultyLevel == 'custom' && <>
                                    <label className="col-xl-4 mt-2" htmlFor="duration"><b>Preview duration (secs):</b></label>
                                    <input className="col-xl-6 mt-2" type="number" id="duration" name="duration" max={29} min={1} required />
                                    <label className="col-xl-4 mt-2" htmlFor="tries"><b>Number of Tries:</b></label>
                                    <input className="col-xl-6 mt-2" type="number" id="tries" name="tries" max={99} min={1} required />
                                    <label className="col-xl-4 mt-2" htmlFor="artistChecked"><b>Include artist name: </b></label>
                                    <input className={`col-xl-1 mt-2`} type="checkbox" id="artistChecked" name="artistChecked" max={29} min={1} />
                                    <div className="col-xl-5 mt-2"></div>
                                </>}
                                <button className="col-4 mt-2" type="submit">Find</button>
                            </form>
                        </div>
                    </div>)}
                <div className="row col-xl-6 mt-2 d-flex justify-content-center mt-4">
                    <h2 className="col-xl-8 mt-2 d-flex align-self-center justify-content-center">How to play Guess Game?</h2>
                    <p className="col-xl-8 align-self-center">First you must generate a random song and then guess which is it, you need to open the sidebar with the top left button,
                        choose between genre, playlist or artist and fill in the information, then you must press the ¨find¨ button and a song will be generated on the
                        right side of the page, with a certain duration, number of attempts and if you chose it, the option to also guess the artist. Now you should listen
                        to the mystery track and fill in the song name and artist name fields (if you have it), finally, press the ¨guess¨ button to see if your guess
                        is correct. Good luck!
                    </p>
                </div>
                <div className={`${styles['main-column']} row col-xl-6 mt-4 border-start`}>
                    <form className="row col-12 align-self-center" id="formGuess" onSubmit={handleSubmit}>
                        <div className="row col-xl-6">
                            <label className={`col-xl-4  mt-3`} htmlFor="songName"><b>Song Name:</b></label>
                            <input className={`col-xl-8 ${styles.input} mt-3`} disabled={!response.name} type="text" id="songName" name="songName" required />
                            {selectedOption.typeOfSearch != "artist" && difficulty.artist ? <>
                                <label className="col-xl-4 my-3"><b>Artist Name:</b></label>
                                <input className={`col-xl-8 ${styles.input} my-3`} disabled={!response.name} type="text" id="artistName" name="artistName" required />
                            </> : <div className="col-xl-10 my-3"></div>}
                        </div>
                        <div className="row col-xl-6 d-flex justify-content-center">
                            {response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Tries: {difficulty.tries}</h4>}
                            {!response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Find a song to Start!</h4>}
                            <button className={`col-6 ${styles.input} my-2`} disabled={!response.name} type="submit">Guess!</button>
                        </div>
                    </form>
                    <div className="row col-xl-12 mt-4 border-start">
                        {response.name && winner && <>
                            <div className="row d-flex justify-content-center mt-3">
                                <div className="card col-xl-10">
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src={response.image} alt="Picture of album from artist"></img>
                                            <div className="row col-xl-8">
                                                <h5 className="card-title col-12">{response.name}</h5>
                                                <p className="card-text col-12">{listOfArtist()}</p>
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
                                <div className="card col-xl-10">
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src={response.image} alt="Picture of album from artist"></img>
                                            <div className="row col-xl-8">
                                                <h5 className="card-title col-12">{response.name}</h5>
                                                <p className="card-text col-12">{listOfArtist()}</p>
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
                                <div className="card col-xl-10">
                                    <div className="card-body">
                                        <div className="row col-12">
                                            <img className="col-xl-4" src="/images/question.JPG" alt="Picture of album from artist"></img>
                                            <div className="row col-xl-8">
                                                <h5 className="card-title col-12">????????</h5>
                                                <p className="card-text col-12">????</p>
                                                {!isPlaying && <button className={`col-4 align-self-start ${styles.input}`} onClick={startPlayback}>Play</button>}
                                                {isPlaying && <button className={`col-4 align-self-start ${styles.input}`} onClick={stopPlayback}>Stop</button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
            {console.log(response)}
        </Layout>
    )
}