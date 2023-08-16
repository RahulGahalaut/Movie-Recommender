import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Navigate, useParams } from "react-router-dom";
import "./MovieInfo.css";
import RecommendedMovies from "./movie-info-components/RecommendedMovies";
import Loader from "../loaders/Loader";

const MovieInfo = () => {
    const { movie_id } = useParams();
    let [movie, setMovie] = useState([]);
    let [backgroundImage, setBackgroundImage] = useState()
    let [posterImage, setPosterImage] = useState()
    let [loading, setLoading] = useState(false);

    console.log(movie_id)
    useEffect(() => {
        async function fetchedMovieInfo() {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/movies/info`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        movie_id: movie_id
                    }
                });
                let fetchedMovie = response.data;
                console.log(fetchedMovie)
                setMovie(fetchedMovie);
                setBackgroundImage({
                    backgroundImage: `url(${process.env.REACT_APP_MOVIE_BACKDROP_ORIGINAL_PATH + fetchedMovie.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundOrigin: "center",

                })
                setPosterImage({
                    backgroundImage: `url(${process.env.REACT_APP_MOVIE_BACKDROP_POSTER_PATH + fetchedMovie.poster_path})`,
                    backgroundSize: "cover",
                    backgroundOrigin: "center"
                })
            }
            catch (err) {
                if (err.response.status == 401 || err.response.status == 422) {
                    localStorage.removeItem('token');
                    return (
                        <Navigate to='/login' />
                    )
                }
                console.log("Error is:", err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchedMovieInfo();
    }, [movie_id]);
    return loading ? (
        <Loader />
    ) : (
        <div className="recommended-and-movie-info-wrapper">
            <div className="movie-container" style={backgroundImage}>
                <div className="movie-info-poster-wrapper">
                    <div className="movie-poster-container" style={posterImage}>
                    </div>
                    <div className="movie-info-container">
                        <div className="movie-title">{movie.title}</div>
                        <div>
                            <div className="movie-rating">Rating - {(+(movie.vote_average)).toFixed(1)}/10</div>
                            <div className="release-date">Released on - {movie.release_date}</div>
                        </div>
                        <div className="movie-genres">
                            {
                                movie.genres?.map(genre => {
                                    return (
                                        <div className="movie-genre">{genre.name}</div>
                                    )
                                })
                            }
                        </div>
                        <div className="movie-info-overview">{movie.overview}</div>
                        <div><a href={movie.homepage} className="movie-homepage" target="_blank">{"Know More >>"}</a></div>

                    </div>
                </div>
            </div>
            <RecommendedMovies movie_id={movie.id} />
        </div>

    )
}

export default MovieInfo;