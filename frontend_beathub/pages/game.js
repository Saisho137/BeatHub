import Layout from "../components/layout"
import { useRef, useState } from "react"
import axios from "axios"

export default function Game () {
    const [response, setResponse] = useState({})
    const [selectedOption, setSelectedOption] = useState('genre')
    const [winner, setWinner] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [trys, setTrys] = useState(3)

    const timeoutRef = useRef(null);
    const audioRef = useRef(null)

    const listOfArtist = () => {
        const listOfArtist = response.artistName.map(name => (name.toString())).join(', ')
        return listOfArtist
    }

    const startPlayback = (duration) => {
        setIsPlaying(true)
        audioRef.current.volume = 0.33
        audioRef.current.play()

        timeoutRef.current = setTimeout(() => {
            setIsPlaying(false)
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }, 5000)
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
        switch (selectedOption) {
            case "artist":
                if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())) {
                    if (trys == 0) {
                        alert("YOU LOSE :( - try another song!")
                        return
                    }
                    setWinner(true)
                    setTrys(3)
                    alert("YOU WIN!!!")
                    break
                } else {
                    setWinner(false)
                    if (trys == 0) {
                        alert("YOU LOSE :( - try another song!")
                        return
                    }
                    setTrys(trys - 1)
                    alert("KEEP TRYING!")
                    break
                }
            default:
                const artist = event.target.artistName.value
                if (songName.toLowerCase().trim().includes(response.name.toLowerCase().trim())
                    && response.artistName.map(name => (name.toLowerCase())).includes(artist.toLowerCase())) {
                    if (trys == 0) {
                        alert("YOU LOSE :( - try another song!")
                        return
                    }
                    setWinner(true)
                    setTrys(3)
                    alert("YOU WIN!!!")
                    break
                } else {
                    setWinner(false)
                    if (trys == 0) {
                        alert("YOU LOSE :( - try another song!")
                        return
                    }
                    setTrys(trys - 1)
                    alert("KEEP TRYING!")
                    break
                }
        }

    }

    const handleSubmitTrack = async (event) => {
        event.preventDefault()

        const token = sessionStorage.getItem('token')
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        setWinner(false)
        setTrys(3)


        switch (selectedOption) {
            case "genre":
                const { data } = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption, searchItem: event.target.genre.value }, headers)
                setResponse(data.Track)
                break
            case "playlist":
                const playlist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption, searchItem: event.target.playlist.value }, headers)
                setResponse(playlist.data.Track)
                break
            case "artist":
                const artist = await axios.post('http://localhost:8080/getRandomTrack', { findBy: selectedOption, searchItem: event.target.artist.value }, headers)
                setResponse(artist.data.Track)
                break
            default:
                console.log("Default")
        }
    }

    const handleSelectionChange = (event) => {
        setSelectedOption(event.target.value)
    }

    return (
        <Layout>
            <div className="row">
                <div className="row col-xl-6 d-flex justify-content-center mt-4">
                    <label className="col-xl-3" htmlFor="typeOfSearch"><b>Select Type of Search:</b></label>
                    <select className="col-xl-7" id="typeOfSearch" value={selectedOption} onChange={handleSelectionChange}>
                        <option value="genre">Genre</option>
                        <option value="playlist">Playlist</option>
                        <option value="artist">Artist</option>
                    </select>
                    <form className="row col-12 d-flex justify-content-center" onSubmit={handleSubmitTrack}>
                        {selectedOption == "genre" && <>
                            <label className="col-xl-3" htmlFor="genre"><b>Genre:</b></label>
                            <input className="col-xl-7" type="text" id="genre" name="genre" required />
                        </>}
                        {selectedOption == "playlist" && <>
                            <label className="col-xl-3" htmlFor="playlist"><b>Playlist:</b></label>
                            <input className="col-xl-7" type="text" id="playlist" name="playlist" required />
                        </>}
                        {selectedOption == "artist" && <>
                            <label className="col-xl-3" htmlFor="artist"><b>Artist:</b></label>
                            <input className="col-xl-7" type="text" id="artist" name="artist" required />
                        </>}
                        <button className="col-4 mt-2" type="submit">Find</button>
                    </form>
                </div>
                <div className="row col-xl-6  mt-4 border-start">
                    <form className="row col-12" onSubmit={handleSubmit}>
                        <div className="row col-xl-6">
                            <label className="col-xl-4 mt-3" htmlFor="songName"><b>Song Name:</b></label>
                            <input className="col-xl-6 mt-3" disabled={!response.name} type="text" id="songName" name="songName" required />
                            {selectedOption != "artist" && <>
                                <label className="col-xl-4 my-3"><b>Artist Name:</b></label>
                                <input className="col-xl-6 my-3" disabled={!response.name} type="text" id="artistName" name="artistName" required />
                            </>}
                        </div>
                        <div className="row col-xl-6">
                            {response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Tries: {trys}</h4>}
                            {!response.name && <h4 className="col-12 d-flex justify-content-center mt-3">Find a song to Start!</h4>}
                            <button className="col-6 offset-3 my-2" disabled={!response.name} type="submit">Guess!</button>
                        </div>
                    </form>
                </div>
                <div className="row col-xl-6 mt-4">

                </div>
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
                    {response.name && !winner && trys == 0 && <>
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
                    {response.name && !winner && trys > 0 && <div className="row d-flex justify-content-center mt-3">
                        <audio ref={audioRef} src={response.preview}></audio>
                        {!isPlaying && <button className="col-4" onClick={startPlayback}>Play</button>}
                        {isPlaying && <button className="col-4" onClick={stopPlayback}>Stop</button>}
                    </div>}
                </div>
                {console.log(response)}
            </div>
        </Layout>
    )
}