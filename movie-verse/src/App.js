import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MovieList from './components/MovieList';
import About from './components/About';
import Contact from './components/Contact';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import './style.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [page, setPage] = useState(1);
  const [movieType, setMovieType] = useState('popular');
  
  useEffect(() => {
    fetchMovies(movieType, page);
  }, [page, movieType]);

  const fetchMovies = (type, page, query) => {
    let url;
    const api_key = '50e49373c2098323b103d3c5f02f42c8';
    if (type === 'popular') {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}`;
    } else if (type === 'new') {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=${page}`;
    } else if (type === 'upcoming') {
      url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=${page}`;
    } else if (type === 'tv') {
      url = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&language=en-US&page=${page}`;
    } else if (type === 'search') {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${query}&page=${page}` ;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies(prevMovies => [...prevMovies, ...data.results]); 
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  };

  const searchMovie = () => {
    const query = document.getElementById('query').value;
    fetchMovies('search', 1, query);
    setCurrentPage('home');
  };

  const navigate = (type) => {
    setCurrentPage(type); 
    setPage(1);
    setMovieType(type);
    if(type === 'popular' || type === 'new' || type === 'upcoming' || type === 'tv'){
      fetchMovies(type,1);
    }
  };

  const showMoreMovies = () => {
    setPage(prevPage => prevPage + 1);
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <MovieList movies={movies} onShowMore={showMoreMovies} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'disclaimer':
        return <Disclaimer />;
      default:
        return <MovieList movies={movies} onShowMore={showMoreMovies}/>;
    }
  };

  return (
    <div className="App">
      <Header onSearch={searchMovie} onNavigate={navigate} />
      {renderPage()}
      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;


