import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.accessToken);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          margin: '40px auto 0 auto',
          padding: 32,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px #0001',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>Admin Login</h2>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter admin username"
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s',
            marginBottom: 6
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1.5px solid #bdbdbd'}
          autoComplete="username"
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Enter admin password"
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s',
            marginBottom: 6
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1.5px solid #bdbdbd'}
          autoComplete="current-password"
        />
        <button
          type="submit"
          style={{
            padding: '12px 0',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #1976d2 60%, #43cea2 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            border: 'none',
            marginTop: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #1976d233'
          }}
        >
          Admin Login
        </button>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
      <div style={{ flex: 1 }} />
    </div>
  );
}
