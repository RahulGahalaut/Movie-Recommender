import { useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import './ProtectedPage.css';
const ProtectedPage = () => {
    const [login, setLogin] = useState(Boolean(localStorage.getItem('token')));
    const navigationList = [
        {
            name: "HOME",
            navigateTo: "/"
        },
        {
            name: 'CONTACT',
            navigateTo: '/contact'
        },
        {
            name: 'ABOUT US',
            navigateTo: '/about'
        }
    ]

    function logout() {
        localStorage.removeItem('token');
        setLogin(false);
    }

    return login ? (
        <div className="protected-conatiner">
            <header>
                <div className="navbar">
                    {
                        navigationList.map(navigation => {
                            return <NavLink to={navigation.navigateTo} className="nav-link">{navigation.name}</NavLink>
                        })
                    }
                    <button onClick={logout}>LOGOUT</button>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <b>Copyrights@2023</b>
            </footer>
        </div>
    ) : (
        <Navigate to='/login' />
    )
};

export default ProtectedPage;