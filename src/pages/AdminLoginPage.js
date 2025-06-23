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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Admin Username" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Login</button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </form>
  );
}
