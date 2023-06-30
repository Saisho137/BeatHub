import Layout from "../components/layout"
import { useRef, useState } from "react"
import axios from "axios"

export default function Game() {
    const [response, setResponse] = useState({})
    const [selectedOption, setSelectedOption] = useState({
        typeOfSearch: 'genre',
        difficultyLevel: 'easy'
    })
    const [winner, setWinner] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [difficulty, setDifficulty] = useState({
        tries: 3,
        duration: 5,
        artist: true
    })

    const timeoutRef = useRef(null);
    const audioRef = useRef(null)

    const listOfArtist = () => {
        const listOfArtist = response.artistName.map(name => (name.toString())).join(', ')
        return listOfArtist
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
            alert("you already Win!")
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


    }

    const handleSubmitTrack = async (event) => {
        event.preventDefault()
        setWinner(false)

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
    }

    const handleSelectionChange = (event) => {
        setSelectedOption({ ...selectedOption, typeOfSearch: event.target.value })
    }

    const handleSelectionChangeDifficult = (event) => {
        setSelectedOption({ ...selectedOption, difficultyLevel: event.target.value })
    }

    return (
        <Layout>
            <div className="row">
                <div className="row col-xl-6 d-flex justify-content-center mt-4">
                    <form className="row col-12 d-flex justify-content-center" onSubmit={handleSubmitTrack}>
                        <label className="col-xl-3 mt-3" htmlFor="typeOfSearch"><b>Select Type of Search:</b></label>
                        <select className="col-xl-7 mt-3" id="typeOfSearch" value={selectedOption.typeOfSearch} onChange={handleSelectionChange}>
                            <option value="genre">Genre</option>
                            <option value="playlist">Playlist</option>
                            <option value="artist">Artist</option>
                        </select>
                        {selectedOption.typeOfSearch == "genre" && <>
                            <label className="col-xl-3 mt-2" htmlFor="genre"><b>Genre:</b></label>
                            <input className="col-xl-7 mt-2" type="text" id="genre" name="genre" required />
                        </>}
                        {selectedOption.typeOfSearch == "playlist" && <>
                            <label className="col-xl-3 mt-2" htmlFor="playlist"><b>Playlist:</b></label>
                            <input className="col-xl-7 mt-2" type="text" id="playlist" name="playlist" required />
                        </>}
                        {selectedOption.typeOfSearch == "artist" && <>
                            <label className="col-xl-3 mt-2" htmlFor="artist"><b>Artist:</b></label>
                            <input className="col-xl-7 mt-2" type="text" id="artist" name="artist" required />
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
                            <label className="col-xl-3 mt-2" htmlFor="artistChecked"><b>Also artist name: </b></label>
                            <input className="col-xl-7 mt-2" type="checkbox" id="artistChecked" name="artistChecked" max={29} min={1} />
                        </>}
                        <button className="col-4 mt-2" type="submit">Find</button>
                    </form>
                </div>
                <div className="row col-xl-6  mt-4 border-start">
                    <form className="row col-12" onSubmit={handleSubmit}>
                        <div className="row col-xl-6">
                            <label className="col-xl-4 mt-3" htmlFor="songName"><b>Song Name:</b></label>
                            <input className="col-xl-6 mt-3" disabled={!response.name} type="text" id="songName" name="songName" required />
                            {selectedOption.typeOfSearch != "artist" && difficulty.artist ? <>
                                <label className="col-xl-4 my-3"><b>Artist Name:</b></label>
                                <input className="col-xl-6 my-3" disabled={!response.name} type="text" id="artistName" name="artistName" required />
                            </> : <div className="col-xl-10 my-3"></div>}
                        </div>
                        <div className="row col-xl-6">
                            {response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Tries: {difficulty.tries}</h4>}
                            {!response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Find a song to Start!</h4>}
                            <button className="col-6 offset-3 my-2" disabled={!response.name} type="submit">Guess!</button>
                        </div>
                    </form>
                </div>
                <div className="row col-xl-6 mt-4"></div>
                <div className="row col-xl-6 mt-4 border-start">
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
                    {response.name && !winner && difficulty.tries > 0 && <div className="row d-flex justify-content-center mt-3">
                        <audio ref={audioRef} src={response.preview}></audio>
                        {!isPlaying && <button className="col-4" onClick={startPlayback}>Play</button>}
                        {isPlaying && <button className="col-4" onClick={stopPlayback}>Stop</button>}
                    </div>}
                </div>
            </div>
            {console.log(response.name, response.artistName)}
        </Layout>
    )
}