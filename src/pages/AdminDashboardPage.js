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
            <div style={{ marginTop: 12, display: 'flex', gap: 24, alignItems: 'center' }}>
              <button
                style={{
                  background: '#ffeaea',
                  border: '1px solid #ff5252',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                title="Delete"
                onClick={() => handleDelete(movie._id)}
              >
                <svg width="20" height="20" fill="#ff5252" viewBox="0 0 20 20"><path d="M7 8v6m3-6v6m3-6v6M4 6h12M5 6V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1m-1 0v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h10z" stroke="#ff5252" strokeWidth="1.2" fill="none"/></svg>
              </button>
              <button
                style={{
                  background: '#e3f0ff',
                  border: '1px solid #1976d2',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                title="Edit"
                onClick={() => {
                  onEdit(movie);
                  navigate(`/admin/dashboard/edit/${movie._id}`);
                }}
              >
                <svg width="20" height="20" fill="#1976d2" viewBox="0 0 20 20"><path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.09 1.09-1.7-1.7 1.09-1.09zm-2.12 2.12l1.7 1.7-8.43 8.43c-.13.13-.29.23-.47.27l-2.5.5a.5.5 0 0 1-.59-.59l.5-2.5c.04-.18.14-.34.27-.47l8.43-8.43z"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditMovieForm({ movie, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: movie.title || '',
    description: movie.description || '',
    genre: movie.genre || '',
    language: movie.language || '',
    releaseDate: movie.releaseDate || '',
    duration: movie.duration || '',
    cast: movie.cast || '',
    director: movie.director || '',
    image: null,
    video: null,
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Movie name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.genre.trim()) newErrors.genre = 'Genre is required';
    if (!form.language.trim()) newErrors.language = 'Language is required';
    if (!form.releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!form.duration.trim()) newErrors.duration = 'Duration is required';
    if (!form.cast.trim()) newErrors.cast = 'Cast is required';
    if (!form.director.trim()) newErrors.director = 'Director is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('Please fix the errors above.');
      setLoading(false);
      return;
    }
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
      if (onUpdated) onUpdated();
      setTimeout(() => {
        setStatus('');
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to update movie');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px #0001',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }}
    >
      <h2 style={{
        textAlign: 'center',
        marginBottom: 8,
        color: '#1976d2',
        fontWeight: 700,
        letterSpacing: 1
      }}>Edit Movie</h2>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Movie Title"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.title && <div style={{ color: 'red', marginTop: 4 }}>{errors.title}</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Genre</label>
          <input
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Genre"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.genre && <div style={{ color: 'red', marginTop: 4 }}>{errors.genre}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="Language"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.language && <div style={{ color: 'red', marginTop: 4 }}>{errors.language}</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Release Date</label>
          <input
            name="releaseDate"
            type="date"
            value={form.releaseDate}
            onChange={handleChange}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.releaseDate && <div style={{ color: 'red', marginTop: 4 }}>{errors.releaseDate}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Duration</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 2h 10m"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.duration && <div style={{ color: 'red', marginTop: 4 }}>{errors.duration}</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Director</label>
          <input
            name="director"
            value={form.director}
            onChange={handleChange}
            placeholder="Director"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.director && <div style={{ color: 'red', marginTop: 4 }}>{errors.director}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Cast</label>
          <input
            name="cast"
            value={form.cast}
            onChange={handleChange}
            placeholder="Cast (comma separated)"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none'
            }}
            required
          />
          {errors.cast && <div style={{ color: 'red', marginTop: 4 }}>{errors.cast}</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Movie Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{
              padding: '8px 0',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 15,
              outline: 'none',
              background: '#f8f8f8'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Movie Description"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 16,
              outline: 'none',
              minHeight: 70,
              resize: 'vertical'
            }}
            required
          />
          {errors.description && <div style={{ color: 'red', marginTop: 4 }}>{errors.description}</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 500, color: '#333', marginBottom: 6 }}>Movie File</label>
          <input
            name="video"
            type="file"
            accept="video/*"
            onChange={handleChange}
            style={{
              padding: '8px 0',
              borderRadius: 8,
              border: '1.5px solid #bdbdbd',
              fontSize: 15,
              outline: 'none',
              background: '#f8f8f8'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #1976d2 60%, #43cea2 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px #1976d233'
          }}
        >
          {loading ? 'Updating...' : 'Update Movie'}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 8,
            background: '#aaa',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
      {status && (
        <div style={{
          marginTop: 10,
          color: status.includes('success') ? 'green' : 'red',
          textAlign: 'center',
          fontWeight: 500
        }}>
          {status}
        </div>
      )}
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

function UserListPage() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [editUser, setEditUser] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });
    setRefresh(r => !r);
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  if (loading) return <div>Loading users...</div>;
  if (editUser) return <EditUserForm user={editUser} onClose={() => { setEditUser(null); setRefresh(r => !r); }} />;
  if (!users.length) return <div>No users found.</div>;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 32,
      maxWidth: 800,
      margin: '0 auto',
      boxShadow: '0 4px 24px #0001'
    }}>
      <h2 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 700, textAlign: 'center' }}>Registered Users</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        background: '#fafbfc',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px #1976d211'
      }}>
        <thead>
          <tr style={{ background: '#f5f6fa' }}>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #e3e3e3', textAlign: 'left', fontWeight: 600, color: '#333' }}>#</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #e3e3e3', textAlign: 'left', fontWeight: 600, color: '#333' }}>Username</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #e3e3e3', textAlign: 'left', fontWeight: 600, color: '#333' }}>Email</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #e3e3e3', textAlign: 'left', fontWeight: 600, color: '#333' }}>Registered At</th>
            <th style={{ padding: '14px 12px', borderBottom: '2px solid #e3e3e3', textAlign: 'left', fontWeight: 600, color: '#333' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id} style={{ background: idx % 2 === 0 ? '#fff' : '#f7f9fa' }}>
              <td style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', color: '#888' }}>{idx + 1}</td>
              <td style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>{u.username}</td>
              <td style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0' }}>{u.email || <span style={{ color: '#bbb' }}>-</span>}</td>
              <td style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', color: '#555' }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleString() : <span style={{ color: '#bbb' }}>-</span>}
              </td>
              <td style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0' }}>
                <button
                  style={{ marginRight: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                  title="Edit"
                  onClick={() => handleEdit(u)}
                >
                  <svg width="20" height="20" fill="#1976d2" viewBox="0 0 20 20"><path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.09 1.09-1.7-1.7 1.09-1.09zm-2.12 2.12l1.7 1.7-8.43 8.43c-.13.13-.29.23-.47.27l-2.5.5a.5.5 0 0 1-.59-.59l.5-2.5c.04-.18.14-.34.27-.47l8.43-8.43z"/></svg>
                </button>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                  title="Delete"
                  onClick={() => handleDelete(u._id)}
                >
                  <svg width="20" height="20" fill="#ff5252" viewBox="0 0 20 20"><path d="M7 8v6m3-6v6m3-6v6M4 6h12M5 6V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1m-1 0v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h10z" stroke="#ff5252" strokeWidth="1.2" fill="none"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditUserForm({ user, onClose }) {
  const [form, setForm] = React.useState({
    username: user.username,
    email: user.email || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    sex: user.sex || '',
    dob: user.dob || ''
  });
  const [status, setStatus] = React.useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.put(`http://localhost:3000/api/admin/users/${user._id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setStatus('User updated successfully!');
      setTimeout(onClose, 1000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fff',
      padding: 32,
      borderRadius: 8,
      maxWidth: 400,
      margin: '40px auto',
      boxShadow: '0 4px 24px #0001',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }}>
      <h2>Edit User</h2>
      <label>Username</label>
      <input name="username" value={form.username} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }} />
      <label>Email</label>
      <input name="email" value={form.email} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }} />
      <label>First Name</label>
      <input name="firstName" value={form.firstName} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }} />
      <label>Last Name</label>
      <input name="lastName" value={form.lastName} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }} />
      <label>Sex</label>
      <select name="sex" value={form.sex} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }}>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <label>Date of Birth</label>
      <input name="dob" type="date" value={form.dob} onChange={handleChange} style={{ padding: 10, borderRadius: 6, border: '1.5px solid #bdbdbd' }} />
      <button type="submit" style={{ padding: 10, borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', marginTop: 10 }}>Update</button>
      <button type="button" onClick={onClose} style={{ padding: 10, borderRadius: 6, background: '#aaa', color: '#fff', border: 'none', marginTop: 10 }}>Cancel</button>
      {status && <div style={{ marginTop: 10, color: status.includes('success') ? 'green' : 'red' }}>{status}</div>}
    </form>
  );
}

function AdminDashboardPage() {
  const adminToken = localStorage.getItem('adminToken');
  const [editMovie, setEditMovie] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState(() => localStorage.getItem('adminDashboardView') || 'movies');
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>
      <aside style={{
        width: 220,
        background: '#3a4668',
        color: '#fff',
        padding: '32px 0',
        minHeight: '100vh', // ensure sidebar stretches to full viewport height
        display: 'flex',
        flexDirection: 'column'
      }}>
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
                onClick={() => navigate('/admin/dashboard/users')}
              >
                👥 All Users
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40, minHeight: '100vh', background: '#f5f6fa' }}>
        <Routes>
          <Route path="home" element={<AdminDashboardHome />} />
          <Route path="add" element={<AddMovieForm onClose={() => navigate('/admin/dashboard/movies')} />} />
          <Route path="movies" element={<AdminMovieList onEdit={setEditMovie} key={refresh} />} />
          <Route path="edit/:id" element={editMovie ? <EditMovieForm movie={editMovie} onClose={() => navigate('/admin/dashboard/movies')} onUpdated={() => setRefresh(r => !r)} /> : <Navigate to="/admin/dashboard/movies" />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard/movies" />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboardPage;