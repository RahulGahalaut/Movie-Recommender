import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"
import Loader from "./loaders/Loader";
const LoginPage = () => {

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem('remember')));
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        const rememberedCredentials = JSON.parse(localStorage.getItem('rememberedCredentials'));
        if (rememberedCredentials) {
            setEmail(rememberedCredentials.email);
            setPassword(rememberedCredentials.password);
            setRememberMe(true);
        }
    }, [])

    function handleRememberMeChange() {
        setRememberMe(!rememberMe);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/users/login`, {
                email: email.trim(),
                password: password.trim()
            });
            console.log(response.data)
            const token = response.data['token'];
            localStorage.setItem('token', token);

            if (rememberMe) {
                localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
            }
            else {
                localStorage.removeItem('rememberedCredentials');
            }
        }

        catch (err) {
            if (err.response?.data) {
                alert(err.response.data?.message)
            }
            console.error("error is:", err);
        }
        finally {
            setLoading(false);
        }

    }

    return localStorage.getItem('token') ? (
        <Navigate to="/" />
    ) : (
        <>
            {
                loading ? (
                    <Loader />
                ) : (
                    <div className="login-form-container">
                        <h3>Login to your Account</h3>
                        <form onSubmit={handleSubmit} >
                            <div>
                                <label htmlFor="email">Email</label><br />
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} minLength="10" />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label><br />
                                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="8" />
                            </div>
                            <div>
                                <input id="checkbox" type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
                                <label htmlFor="checkbox">
                                    Remember me
                                </label>
                            </div>
                            <button type="submit"><b>LOGIN</b></button>
                            <div>new to myApp? <NavLink to='/register'>Register</NavLink></div>
                        </form>
                    </div>
                )
            }
        </>

    )
}

export default LoginPage;