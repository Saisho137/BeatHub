import Layout from "../components/layout"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"

const Game = () => {
    const [response, setResponse] = useState('')
    const [trys, setTrys] = useState('0')
    //intentos useSatate

    const getRandomTrack = () => {
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const songName = event.target.songName.value;
        const artist = event.target.artistName.value;
        console.log(songName, artist);

    }

    return (
        <Layout>
            <div className="row">
                <div className="col-5 d-flex justify-content-center border mt-4">
                    <h2>-------- HOW TO PLAY GUESS THE SONG ----------
                        First of all, you need to ...
                    </h2>
                </div>
                <div className="row offset-1 col-6  mt-4">
                    <form className="row col-12 border" onSubmit={handleSubmit}>
                        <label className="col-2" htmlFor="songName"><b>Song Name:</b></label>
                        <input className="col-4" type="text" id="songName" name="songName" required />
                        <h3 className="col-4 offset-1 d-flex justify-content-center">Trys: {trys}</h3>
                        <label className="col-2"><b>Artist Name:</b></label>
                        <input className="col-4" type="text" id="artistName" name="artistName" required />
                        <button className="col-4 offset-1" type="submit">Find</button>
                    </form>
                    {response != undefined ?
                        <div className="col-6 offset-3 mt-3 border">
                            <audio className="col-12" controls src="https://p.scdn.co/mp3-preview/e73f8be53d4445b195c3c22a44bc0e65daf2bf59?cid=0b297fa8a249464ba34f5861d4140e58"></audio>
                        </div>
                        :
                        <p>Si no</p>}
                </div>
            </div>
        </Layout>
    )
}

export default Game