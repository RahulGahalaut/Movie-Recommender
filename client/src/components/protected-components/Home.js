import axios from "axios";
import { useEffect, useState } from "react";
import SearchResults from "./home-components/SearchResults";
import InterestedMovies from "./home-components/InterestedMovies";
import "./Home.css";
const Home = () => {
    let [movieName, setMovieName] = useState("");
    return (
        <>
            <div className="search-bar">
                <div>SEARCH</div>
                <input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)} placeholder="type to search movies" />
            </div>
            {
                movieName ? <SearchResults movieName={movieName} /> : <InterestedMovies />
            }
        </>
    )
}
export default Home;