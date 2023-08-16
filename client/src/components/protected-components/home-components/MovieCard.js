import { NavLink } from "react-router-dom";
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const style = {
        backgroundImage: `url(${process.env.REACT_APP_MOVIE_POSTER_CARD_PATH + movie.poster_path})`,
    }
    return (
        <NavLink to={`/${movie.id}`} className="movie-link">
            <div className="movie-card" style={style}>
                <div className="movie-overview">
                    <div className="movie-rating">
                        Rating - {(+(movie.vote_average)).toFixed(1)}/10
                    </div>
                    <p>{movie.overview}</p>
                </div>
                <div className="movie-title"><b>{movie.title.toUpperCase()}</b></div>
            </div>
        </NavLink>
    )
}

export default MovieCard;