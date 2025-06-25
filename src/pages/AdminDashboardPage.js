import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMovieForm from './AddMovieForm';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

function AdminMovieList({ onEdit }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingMovie, setPlayingMovie] = useState(null);
  const navigate = useNavigate();

  const fetchMovies = () => {
    setLoading(true);
    axios.get('http://localhost:3000/api/admin/movies', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => {
        setMovies(res.data.movies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    await axios.delete(`http://localhost:3000/api/admin/movies/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchMovies();
  };

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
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                style={{ background: '#ff5252', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                onClick={() => handleDelete(movie._id)}
              >Delete</button>
              <button
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                onClick={() => {
                  onEdit(movie);
                  navigate(`/admin/dashboard/edit/${movie._id}`);
                }}
              >Edit</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditMovieForm({ movie, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: movie.title,
    description: movie.description,
    genre: movie.genre,
    language: movie.language,
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    cast: movie.cast,
    director: movie.director,
    image: null,
    video: null,
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    try {
      await axios.put(`http://localhost:3000/api/admin/movies/${movie._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('Movie updated successfully!');
      onUpdated();
      onClose();
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to update movie');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 600 }}>
      <h2>Edit Movie</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Movie Name" required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="genre" value={form.genre} onChange={handleChange} placeholder="Genre" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="language" value={form.language} onChange={handleChange} placeholder="Language" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} placeholder="Release Date" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (e.g. 2h 10m)" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="cast" value={form.cast} onChange={handleChange} placeholder="Cast (comma separated)" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input name="director" value={form.director} onChange={handleChange} placeholder="Director" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <div style={{ marginBottom: 12 }}>
        <label>Movie Image: </label>
        <input name="image" type="file" accept="image/*" onChange={handleChange} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Movie File: </label>
        <input name="video" type="file" accept="video/*" onChange={handleChange} />
      </div>
      <button type="submit" style={{ padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Update Movie</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 16, padding: 10, background: '#aaa', color: '#fff', border: 'none', borderRadius: 4 }}>Cancel</button>
      {status && <div style={{ marginTop: 16, color: status.includes('success') ? 'green' : 'red' }}>{status}</div>}
    </form>
  );
}

function AdminDashboardHome() {
  return (
    <div>
      <h2>Welcome, <b>admin</b>!</h2>
      <p>Select an option from the left menu.</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const adminToken = localStorage.getItem('adminToken');
  const [editMovie, setEditMovie] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to /admin/dashboard/movies if at /admin/dashboard
    if (location.pathname === '/admin/dashboard') {
      navigate('/admin/dashboard/movies', { replace: true });
    }
  }, [location, navigate]);

  // Listen for route changes to set editMovie based on URL
  useEffect(() => {
    const match = location.pathname.match(/^\/admin\/dashboard\/edit\/(.+)$/);
    if (match) {
      const movieId = match[1];
      // Fetch movie details if not already set or if different movie
      if (!editMovie || editMovie._id !== movieId) {
        axios.get(`http://localhost:3000/api/admin/movies`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        }).then(res => {
          const found = (res.data.movies || []).find(m => m._id === movieId);
          if (found) setEditMovie(found);
        });
      }
    } else {
      setEditMovie(null);
    }
  }, [location.pathname]);

  if (!adminToken) {
    return <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>You are not authorized.</div>;
  }

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
                onClick={() => navigate('/admin/dashboard/home')}
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
                onClick={() => navigate('/admin/dashboard/add')}
              >
                ➕ Add Movie
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
                onClick={() => {
                  navigate('/admin/dashboard/movies');
                  setRefresh(r => !r);
                }}
              >
                🎬 All Movies
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40 }}>
        <Routes>
          <Route path="home" element={<AdminDashboardHome />} />
          <Route path="add" element={<AddMovieForm onClose={() => navigate('/admin/dashboard/movies')} />} />
          <Route path="movies" element={<AdminMovieList onEdit={setEditMovie} key={refresh} />} />
          <Route path="edit/:id" element={editMovie ? <EditMovieForm movie={editMovie} onClose={() => navigate('/admin/dashboard/movies')} onUpdated={() => setRefresh(r => !r)} /> : <Navigate to="/admin/dashboard/movies" />} />
          <Route path="*" element={<Navigate to="/admin/dashboard/movies" />} />
        </Routes>
      </main>
    </div>
  );
}
