import Layout from "../components/layout";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";
import recoStyles from "../styles/recommender.module.css";
import { useRouter } from 'next/router'

const recommender = () => {
  const [category, setCategory] = useState("Song");
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/')
    }
  }, [])

  const fetchData = async (searchValue) => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      let response = "";

      switch (category) {
        case "Song":
          if (searchValue !== "") {
            response = await axios.get(`http://localhost:8080/getTrack/${searchValue}`, { headers });
            response = response.data.getTrack;
          }
          break;
        case "Artist":
          if (searchValue !== "") {
            response = await axios.get(`http://localhost:8080/getArtist/${searchValue}`, { headers });
            response = response.data.getArtist;
          }
          break;
        case "Genre":
          response = await axios.get(`http://localhost:8080/getGenre`, { headers });
          response = response.data.getGenre.genres;
          break;
        default:
          break;
      }

      if (category === "Genre" && searchValue !== "") {
        response = response.filter((genre) => genre.toLowerCase().includes(searchValue.toLowerCase()));
      }

      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onSelected = async (param) => {
    try {
      setCategory(param);
      setValue('');
      setData([]);
      fetchData('');
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);

    if (newValue === "") {
      setData([]);
    } else {
      fetchData(newValue);
    }
  };


  const renderTracksAndArtists = () => {
    if (value === "") {
      return <div></div>;
    } else {
      return (
        <ul className="list-group">
          {Array.isArray(data) && data.map((item) => (
            <Link className="theme" href={category === "Song" ? `/song/${item.id}` : `/artist/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
              <li className="row list-group-item align-items-center theme theme-border" key={item.id}>
                <div className="col-auto d-flex align-items-center">
                  <div className={`m-0 ${recoStyles.searchPicContainer}`}>
                    <img
                      className={`img-thumbnail ${recoStyles.searchPic} ${category === "Artist" ? "rounded-circle" : ""}`}
                      src={item.images ? item.images : "/images/person-circle.svg"}
                    />
                  </div>
                  <div className="ms-3">
                    <span className="fs-5 fw-semibold">{item.name}</span>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      );
    }
  };


  const renderGenres = () => {
    if (value === "") {
      return <div></div>;
    } else {
      return (
        <ul className="list-group">
          {Array.isArray(data) && data.map((item) => (
            <Link className="theme" href={`/genre/${item}`} key={item} style={{ textDecoration: "none" }}>
              <li className="list-group-item fs-5 fw-semibold theme">♫ {item}</li>
            </Link>
          ))}
        </ul>
      );
    }
  };

  return (
    <Layout>
      <div className="container mt-5 pt-5">
        <div className="row text-center">
          <div className="col-12">
            <div className="input-group mb-3 theme theme-border">
              <input
                type="text"
                value={value}
                onChange={onChange}
                className="form-control theme theme-border"
                aria-label="search"
              />
              <button
                className="btn btn-outline-secondary dropdown-toggle theme"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>
              <ul className="dropdown-menu theme theme-border">
                <li>
                  <a className="dropdown-item theme" href="#" onClick={() => onSelected("Song")}>
                    Song
                  </a>
                </li>
                <li>
                  <a className="dropdown-item theme" href="#" onClick={() => onSelected("Artist")}>
                    Artist
                  </a>
                </li>
                <li>
                  <a className="dropdown-item theme" href="#" onClick={() => onSelected("Genre")}>
                    Genre
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-12 border-top">
            {category === "Genre" ? renderGenres() : renderTracksAndArtists()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default recommender;