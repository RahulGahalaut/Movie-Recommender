import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css"
import Loader from "./loaders/Loader";
const RegisterPage = () => {

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [interests, setInterests] = useState([]);
    let [genresList, setGenresList] = useState([]);
    let [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem('remember')));
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getGenres() {
            setLoading(true)
            try {
                let response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/movies/genres`);
                let genres = response.data['genres']
                console.log(genres)
                setGenresList(genres)
            }
            catch (err) {
                console.error('Error is:', err);
            }
            finally {
                setLoading(false)
            }
        }
        getGenres()

    }, [])
    function handleRememberMeChange() {
        setRememberMe(!rememberMe);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/users/register`, {
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                interests: interests
            });
            const token = response.data['token'];
            localStorage.setItem('token', token)
            if (rememberMe) {
                localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
            }
            else {
                localStorage.removeItem('rememberedCredentials');
            }
        }
        catch (err) {
            console.error("Error is:", err)
        }
        finally {
            setLoading(false);
        }


    }
    function selectGenre(genreName) {
        let newInterests = [...interests];
        newInterests.push(genreName);
        console.log(newInterests);
        setInterests(newInterests);
    }

    function deselectGenre(genreName) {
        let newInterests = interests.filter(genre => genre != genreName);
        console.log(newInterests);
        setInterests(newInterests);
    }

    return localStorage.getItem('token') ? (
        <Navigate to="/" />
    ) : (
        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <div className="register-form-container">
                        <h3>CREATE NEW ACCOUNT</h3>
                        <form onSubmit={handleSubmit} >
                            <div>
                                <label htmlFor="name">Name</label><br />
                                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} minLength="5" />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label><br />
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} minLength="10" />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label><br />
                                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="8" />
                            </div>
                            <div>
                                <label htmlFor="interests">Select Genres</label><br />
                                <div className="genre-container">
                                    {
                                        genresList.map(genre => {
                                            return (
                                                <div
                                                    onClick={
                                                        () => {
                                                            interests.includes(genre.id.toString()) ? deselectGenre(genre.id.toString()) : selectGenre(genre.id.toString())
                                                        }
                                                    }
                                                    className={
                                                        interests.includes(genre.id.toString()) ? 'genre selected' : 'genre'
                                                    }
                                                >{genre.name}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div>
                                <input id="checkbox" type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                                <label htmlFor="checkbox">
                                    Remember me
                                </label>
                            </div>
                            <button type="submit"><b>REGISTER</b></button>
                            <div>Already have an account? <NavLink to='/login'>LOGIN</NavLink></div>
                        </form>
                    </div>
                )
            }
        </>

    )
}

export default RegisterPage;