import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingMovie, setPlayingMovie] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/movies')
      .then(res => {
        setMovies(res.data.movies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading movies...</div>;
  if (!movies.length) return <div>No movies found.</div>;

  if (playingMovie) {
    return (
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={() => setPlayingMovie(null)} style={{ marginBottom: 16, alignSelf: 'flex-start' }}>⬅ Back to List</button>
        <h2 style={{ textAlign: 'center' }}>{playingMovie.title}</h2>
        <div style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', margin: '0 auto' }}>
          <video
            src={playingMovie.videoUrl}
            controls
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              background: '#000',
              objectFit: 'contain',
              maxHeight: '60vh'
            }}
          />
        </div>
        <div style={{ marginTop: 16, maxWidth: 800 }}>{playingMovie.description}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {movies.map(movie => (
        <div key={movie._id} style={{
          width: 220,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            src={movie.imageUrl}
            alt={movie.title}
            style={{ width: '100%', height: 180, objectFit: 'cover', background: '#eee' }}
          />
          <button
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 48,
              height: 48,
              fontSize: 24,
              cursor: 'pointer',
              opacity: 0.85
            }}
            title="Play Movie"
            onClick={() => setPlayingMovie(movie)}
          >
            ▶
          </button>
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{movie.title}</h3>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>{movie.genre} | {movie.language}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{movie.releaseDate}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{movie.duration}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Cast: {movie.cast}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Director: {movie.director}</div>
            <div style={{ fontSize: 13, color: '#222' }}>{movie.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardHome() {
  const user = useSelector(state => state.auth.user);
  return (
    <>
      <h2>User Dashboard</h2>
      <div>Welcome, <b>{user?.username || 'User'}</b>!</div>
      <p>Select an option from the left menu.</p>
    </>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Redirect to /dashboard/home if at /dashboard
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/home', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '80vh', background: '#f5f6fa' }}>
      <aside style={{ width: 220, background: '#3a4668', color: '#fff', padding: '32px 0', minHeight: '100%' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 18,
                  padding: '12px 32px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/dashboard/home')}
              >
                🏠 Home
              </button>
            </li>
            <li>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 18,
                  padding: '12px 32px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/dashboard/movies')}
              >
                🎬 All Movies
              </button>
            </li>
            {/* Add more user links here if needed */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40 }}>
        <Routes>
          <Route path="home" element={<DashboardHome />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="*" element={<Navigate to="/dashboard/home" />} />
        </Routes>
      </main>
    </div>
  );
}
