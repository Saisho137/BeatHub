import Layout from "../components/layout"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"

const Game = () => {
    const [response, setResponse] = useState({})
    const [trys, setTrys] = useState('3')
    const [selectedOption, setSelectedOption] = useState('genre')

    

    const handleSubmit = (event) => {
        event.preventDefault()

        const songName = event.target.songName.value
        const artist = event.target.artistName.value
        if (songName.toLowerCase() == response.name.toLowerCase() && artist.toLowerCase() == response.artistName.toLowerCase()) {
            alert("YOU WIN!!!")
        } else {
            alert("KEEP TRYING!")
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
                <div className="row col-5 d-flex justify-content-center border mt-4">
                    <label className="col-3" htmlFor="typeOfSearch"><b>Select Type of Search:</b></label>
                    <select className="col-7" id="typeOfSearch" value={selectedOption} onChange={handleSelectionChange}>
                        <option value="genre">Genre</option>
                        <option value="playlist">Playlist</option>
                        <option value="artist">Artist</option>
                    </select>
                    <form className="row col-12 d-flex justify-content-center" onSubmit={handleSubmitTrack}>
                        {selectedOption == "genre" && <>
                            <label className="col-3" htmlFor="genre"><b>Genre:</b></label>
                            <input className="col-7" type="text" id="genre" name="genre" required />
                        </>}
                        {selectedOption == "playlist" && <>
                            <label className="col-3" htmlFor="playlist"><b>Playlist:</b></label>
                            <input className="col-7" type="text" id="playlist" name="playlist" required />
                        </>}
                        {selectedOption == "artist" && <>
                            <label className="col-3" htmlFor="artist"><b>Artist:</b></label>
                            <input className="col-7" type="text" id="artist" name="artist" required />
                        </>}
                        <button className="col-4" type="submit">Find</button>
                    </form>
                </div>
                <div className="row offset-1 col-6  mt-4 border">
                    <form className="row col-12 border" onSubmit={handleSubmit}>
                        <label className="col-2" htmlFor="songName"><b>Song Name:</b></label>
                        <input className="col-4" type="text" id="songName" name="songName" required />
                        <h4 className="col-4 offset-1 d-flex justify-content-center">Trys: {trys}</h4>
                        <label className="col-2"><b>Artist Name:</b></label>
                        <input className="col-4" type="text" id="artistName" name="artistName" required />
                        <button className="col-4 offset-1" type="submit">Try!</button>
                    </form>
                    {response.name ?
                        <div className="col-6 offset-3 mt-3 border">
                            <audio className="col-12" controls src={response.preview}></audio>
                        </div>
                        :
                        <h1 className="col-6 offset-3 mt-3 d-flex justify-content-center border"> PROVICIONAL </h1>}
                    {console.log(response)}
                </div>
            </div>
        </Layout>
    )
}

export default Game