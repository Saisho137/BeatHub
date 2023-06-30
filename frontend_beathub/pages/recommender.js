import Layout from "../components/layout";
import { useState } from "react";
import axios from 'axios';
import recoStyles from "../styles/recommender.module.css";

const recommender = () => {
  const [category, setCategory] = useState("Song");
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      let response = "";
  
      switch (category) {
        case "Song":
          response = await axios.get(`http://localhost:8080/getTrack/${value}`, { headers });
          response = response.data.getTrack;
          break;
        case "Artist":
          response = await axios.get(`http://localhost:8080/getArtist/${value}`, { headers });
          response = response.data.getArtist;
          break;
        case "Genre":
          response = await axios.get(`http://localhost:8080/getGenre`, { headers });
          response = response.data.getGenre.genres;
          break;
        default:
          console.log("default");
          break;
      }
  
      if (category === "Genre") {
        response = response.filter((genre) => genre.toLowerCase().includes(value.toLowerCase()));
      }
  
      console.log(response);
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
      fetchData();
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
      fetchData();
    }
  };


  const renderTracksAndArtists = () => {
    if (value === "") {
      return <div></div>;
    } else {
      return (
        <ul className="list-group">
          {data.map((item) => (
            <li className="row list-group-item align-items-center">
              <div className="col-auto d-flex align-items-center">
                <div className={`m-0 ${recoStyles.searchPicContainer}`}>
                <img
                  className={`img-thumbnail ${recoStyles.searchPic} ${category === "Artist" ? "rounded-circle" : ""}`}
                  src={item.images ? item.images : "/images/person-circle.svg"}
                  />
                </div>
                <div className="ms-3">
                  <span>{item.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  };


  const renderGenres = () => {
    if (value === "") {
      return <div></div>;
    } else {
      return <ul className="list-group">
                  {data.map((item) => (
                      <li className="list-group-item">♫ {item}</li>
                  ))}
              </ul>

    }
  };

  return (
    <Layout>
      <div className="container mt-5 pt-5">
        <div className="row text-center">
          <div className="col-12">
            <div className="input-group mb-3">
              <input
                type="text"
                value={value}
                onChange={onChange}
                className="form-control"
                aria-label="search"
              />
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {category}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#" onClick={() => onSelected("Song")}>
                    Song
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => onSelected("Artist")}>
                    Artist
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => onSelected("Genre")}>
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