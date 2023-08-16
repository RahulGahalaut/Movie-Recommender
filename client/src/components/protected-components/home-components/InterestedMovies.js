import axios from "axios";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import './InterestedMovies.css'
import { Navigate } from "react-router-dom";
import Loader from "../../loaders/Loader";

const InterestedMovies = () => {
    let [page, setPage] = useState(1);
    let [movies, setMovies] = useState([]);
    let [loading, setLoading] = useState(false);
    let [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        interestedMovies(1);
    }, []);

    async function interestedMovies(pageNumber) {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/movies/interested`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    page: pageNumber
                }
            });
            let fetchedMovies = response.data['results'];
            const receivedTotalPages = response.data['total_pages'];

            setMovies(fetchedMovies);
            setPage(pageNumber);
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
        <div className="search-result-container">
            <h2>Movies you may like</h2>
            <div className="movies">
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
                <button onClick={() => interestedMovies(1)} disabled={page <= 1}>Refresh</button>
                <button onClick={() => interestedMovies(--page)} disabled={page <= 1}>Prev</button>
                <button onClick={() => interestedMovies(++page)} disabled={page == totalPages}>Next</button>
            </div>
        </div>
    )
}

export default InterestedMovies;