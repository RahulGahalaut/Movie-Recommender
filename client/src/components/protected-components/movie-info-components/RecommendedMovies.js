import { useEffect, useState } from "react";
import "./RecommendedMovies.css";
import MovieCard from "../home-components/MovieCard";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../loaders/Loader";

const RecommendedMovies = ({ movie_id }) => {
    let [loading, setLoading] = useState('false');
    let [movies, setMovies] = useState([]);
    let [totalPages, setTotalPages] = useState(0)
    let [page, setPage] = useState(0);

    useEffect(() => {
        recommendedMovies(1);
    }, [movie_id])


    async function recommendedMovies(pageNumber) {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/movies/recommended`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    movie_id: movie_id,
                    page: pageNumber
                }
            });
            let fetchedMovies = response.data['results'];
            const receivedTotalPages = response.data['total_pages'];
            const currentPage = response.data['page']

            setMovies(fetchedMovies);
            setPage(currentPage);
            setTotalPages(receivedTotalPages);
        }
        catch (err) {
            if (err.response.status == 401 || err.response.status == 422) {
                localStorage.removeItem('token');
                return (
                    <Navigate to='/login' />
                )
            }
            console.error('Error is:', err);
        }
        finally {
            setLoading(false);
        }
    }

    return loading ? (
        <Loader />
    ) : (
        <div className="recommended-movies-container">
            {
                movies.length ? (
                    <>
                        <h2>Recommended Movies</h2>
                        <div className="recommended-movies">
                            {
                                movies.map((movie, index) => {
                                    return (
                                        <MovieCard key={index} movie={movie} />
                                    )
                                })
                            }
                        </div>
                        <div style={{ color: "white" }}><b>Page {page} of {totalPages}</b></div>
                        <div className="pagination-buttons">
                            <button onClick={() => recommendedMovies(1)} disabled={page <= 1}>Refresh</button>
                            <button onClick={() => recommendedMovies(--page)} disabled={page <= 1}>Prev</button>
                            <button onClick={() => recommendedMovies(++page)} disabled={page >= totalPages}>Next</button>
                        </div>
                    </>
                ) : (
                    <h2>No movies to Show</h2>
                )
            }
        </div>
    )
}

export default RecommendedMovies;