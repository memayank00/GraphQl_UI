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
        gap: 18 // reduced gap for less space between fields
      }}
    >
      <h2 style={{
        textAlign: 'center',
        marginBottom: 8,
        color: '#1976d2',
        fontWeight: 700,
        letterSpacing: 1
      }}>Add New Movie</h2>

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
            required
          />
          {errors.image && <div style={{ color: 'red', marginTop: 4 }}>{errors.image}</div>}
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
            required
          />
          {errors.video && <div style={{ color: 'red', marginTop: 4 }}>{errors.video}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #1976d2 60%, #43cea2 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1976d233'
          }}
        >
          Add Movie
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