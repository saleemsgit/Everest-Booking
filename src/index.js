import React from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";
import NavBar from "./Components/NavBar";
import BookingForm from "./Components/BookingForm";

function App() {
  return <Main />;
}

function Main() {
  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/getmovie`, {
          params: {
            movie: movieName,
          },
        });
        if (response.data) {
          setMovies(response.data.Search);
        } else {
          console.log("Movie Not Found");
        }
      } catch (error) {
        console.log("Error fetching the movie:", error);
      }
    };

    const firstFetch = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/getmovie`, {
          params: {
            movie: "batman",
          },
        });
        if (response.data) {
          setMovies(response.data.Search);
        } else {
          console.log("Movie Not Found");
        }
      } catch (error) {
        console.log("Error fetching the default movie:", error);
      }
    };

    if (movieName) {
      fetchMovie();
    } else {
      firstFetch();
    }
  }, [movieName]);

  function handleChange(e) {
    setMovieName(e.target.value);
  }

  const handleBookClick = () => {
    setIsBookingFormVisible(true);
  };

  const handleCloseBookingForm = () => {
    setIsBookingFormVisible(false);
  };

  return (
    <div>
      <NavBar onChange={handleChange} />
      <h1>Movies To Watch</h1>
      <div className="container">
        {movies &&
          movies.map((movie) => (
            <Card
              key={movie.imdbID}
              movie={movie}
              onBookClick={handleBookClick}
            />
          ))}
      </div>
      {isBookingFormVisible && <BookingForm onClose={handleCloseBookingForm} />}
    </div>
  );
}

function Card({ movie, onBookClick }) {
  return (
    <div className="movie">
      <div className="movie-details">
        <img src={movie.Poster} className="poster" alt={`${movie.Title}`} />
      </div>
      <div className="movie-details">
        <div className="box">
          <h4 className="title">{movie.Title}</h4>
          <button onClick={onBookClick} className="book">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
