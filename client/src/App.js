import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedPage from './components/ProtectedPage';
import Contact from './components/protected-components/Contact';
import Home from './components/protected-components/Home';
import MovieInfo from './components/protected-components/MovieInfo';
import About from './components/protected-components/About';

function App() {
  return (
    <div className='global-container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedPage />} >
            <Route index element={<Home />} />
            <Route path='contact' element={<Contact />} />
            <Route path='about' element={<About />} />
            <Route path=':movie_id' element={<MovieInfo />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
