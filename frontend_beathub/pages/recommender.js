import Layout from "../components/layout"
import { useEffect, useState } from "react"
import axios from 'axios'
import Link from "next/link"
import statisticsStyles from "../styles/statistics.module.css"
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const recommender = () => {
  const [category, setCategory] = useState("Song")
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
  }, [])

  const fetchData = async (searchValue) => {
    try {
      const token = sessionStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      let response = ""

      switch (category) {
        case "Song":
          if (searchValue !== "") {
            response = await axios.get(`/api/recommenderItems/getTrack/${searchValue}`, { headers })
            response = response.data.getTrack
          }
          break
        case "Artist":
          if (searchValue !== "") {
            response = await axios.get(`/api/recommenderItems/getArtist/${searchValue}`, { headers })
            response = response.data.getArtist
          }
          break
        case "Album":
          if (searchValue !== "") {
            response = await axios.get(`/api/recommenderItems/getAlbum/${searchValue}`, { headers })
            response = response.data.getAlbum
          }
          break
        default:
          break
      }

      setData(response)
    } catch (error) {
      if (error.response && error.response.status == 401) {
        sessionStorage.setItem('callback', `recommender`)
        router.push('/callback')
        return
      }
      console.log(error)
    }
  }

  const onSelected = (param) => {
    setCategory(param)
    setValue('')
    setData([])
  }

  const onChange = (event) => {
    const newValue = event.target.value
    setValue(newValue)

    // Genres are searched on submit (Spotify no longer provides a genre list)
    if (category === "Genre") return

    if (newValue === "") {
      setData([])
    } else {
      fetchData(newValue)
    }
  }

  const searchGenre= () =>{
    const searchInput = document.getElementById('searchInput')
    const trimmedInput = searchInput.value.trim()
    if (trimmedInput != ""){
      const searchTerm = trimmedInput.replace(/\s+/g, ' ')
      router.push(`/genre/${searchTerm}`)
    } else {
      toast.warning('No search parameters submitted.', {
        autoClose: 1500,
        position: toast.POSITION.TOP_CENTER,
        closeButton: true,
        className: 'custom-toast',
      })
    }
  }

  const CATEGORIES = ["Song", "Artist", "Album", "Genre"]

  const renderTracksAndArtists = () => {
    if (value === "" || !Array.isArray(data) || data.length === 0) return null
    return (
      <div className="card theme theme-border px-3 text-start">
        {data.map((item, index) => (
          <Link
            key={item.id}
            href={`/${{ Song: 'song', Artist: 'artist', Album: 'album' }[category]}/${item.id}`}
            className={`theme ${index > 0 ? 'border-top theme-border' : ''} ${statisticsStyles.trackRow}`}
          >
            <img
              src={item.images ? item.images : "/images/person-circle.svg"}
              style={category === "Artist" ? { borderRadius: '50%' } : undefined}
              alt=""
            />
            <span className="fw-semibold text-truncate">{item.name}</span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className={`container py-4 py-lg-5 ${statisticsStyles.page}`} style={{ maxWidth: '760px' }}>
        <ToastContainer />
        <div className="text-center mb-4">
          <h1>Explore</h1>
          <p className="text-muted mb-1">Search by song, artist, album or genre by changing the category.</p>
          <p className="text-muted"><span className="fw-semibold">Looking for a genre?</span> Write down the genre and click on search.</p>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={(event) => { if (category === "Genre" && event.key === "Enter") searchGenre() }}
            className="form-control theme theme-border"
            placeholder={`Search ${category.toLowerCase()}s…`}
            aria-label="search"
            id="searchInput"
          />
          <button
            className="btn btn-soft dropdown-toggle"
            style={{ borderRadius: '0 999px 999px 0' }}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {category}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            {CATEGORIES.map(option =>
              <li key={option}>
                <a className={`dropdown-item ${option === category ? 'active' : ''}`} href="#" onClick={(event) => { event.preventDefault(); onSelected(option) }}>
                  {option}
                </a>
              </li>
            )}
          </ul>
        </div>
        {category === "Genre" && (
          <div className="text-center">
            <button className="btn main-color mb-3 mt-2" onClick={() => searchGenre()}>
              Search
            </button>
          </div>
        )}

        {category !== "Genre" && renderTracksAndArtists()}
      </div>
    </Layout>
  )
}
export default recommender
