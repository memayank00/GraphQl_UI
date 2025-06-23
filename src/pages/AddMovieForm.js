import React, { useState } from 'react';
import axios from 'axios';

export default function AddMovieForm({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    language: '',
    releaseDate: '',
    duration: '',
    cast: '',
    director: '',
    image: null,
    video: null,
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

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
    if (!form.image) newErrors.image = 'Movie image is required';
    if (!form.video) newErrors.video = 'Movie file is required';
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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('Please fix the errors above.');
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    try {
      await axios.post('http://localhost:3000/api/admin/movies', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('Movie added successfully!');
      setForm({
        title: '',
        description: '',
        genre: '',
        language: '',
        releaseDate: '',
        duration: '',
        cast: '',
        director: '',
        image: null,
        video: null,
      });
      setErrors({});
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to add movie');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 600 }}>
      <h2>Add Movie</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Movie Name"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.title && <div style={{ color: 'red', marginBottom: 8 }}>{errors.title}</div>}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.description && <div style={{ color: 'red', marginBottom: 8 }}>{errors.description}</div>}

      <input
        name="genre"
        value={form.genre}
        onChange={handleChange}
        placeholder="Genre"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.genre && <div style={{ color: 'red', marginBottom: 8 }}>{errors.genre}</div>}

      <input
        name="language"
        value={form.language}
        onChange={handleChange}
        placeholder="Language"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.language && <div style={{ color: 'red', marginBottom: 8 }}>{errors.language}</div>}

      <input
        name="releaseDate"
        type="date"
        value={form.releaseDate}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.releaseDate && <div style={{ color: 'red', marginBottom: 8 }}>{errors.releaseDate}</div>}

      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        placeholder="Duration (e.g. 2h 10m)"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.duration && <div style={{ color: 'red', marginBottom: 8 }}>{errors.duration}</div>}

      <input
        name="cast"
        value={form.cast}
        onChange={handleChange}
        placeholder="Cast (comma separated)"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.cast && <div style={{ color: 'red', marginBottom: 8 }}>{errors.cast}</div>}

      <input
        name="director"
        value={form.director}
        onChange={handleChange}
        placeholder="Director"
        required
        style={{ width: '100%', marginBottom: 4, padding: 8 }}
      />
      {errors.director && <div style={{ color: 'red', marginBottom: 8 }}>{errors.director}</div>}

      <div style={{ marginBottom: 4 }}>
        <label>Movie Image: </label>
        <input name="image" type="file" accept="image/*" onChange={handleChange} required />
      </div>
      {errors.image && <div style={{ color: 'red', marginBottom: 8 }}>{errors.image}</div>}

      <div style={{ marginBottom: 4 }}>
        <label>Movie File: </label>
        <input name="video" type="file" accept="video/*" onChange={handleChange} required />
      </div>
      {errors.video && <div style={{ color: 'red', marginBottom: 8 }}>{errors.video}</div>}

      <button type="submit" style={{ padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Add Movie</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 16, padding: 10, background: '#aaa', color: '#fff', border: 'none', borderRadius: 4 }}>Cancel</button>
      {status && <div style={{ marginTop: 16, color: status.includes('success') ? 'green' : 'red' }}>{status}</div>}
    </form>
  );
}
