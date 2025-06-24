import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerUser({ username, password }));
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto 0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
        <h2>Register</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Register</button>
        {status === 'failed' && <div>{error}</div>}
      </form>
      <div style={{ flex: 1 }} />
    </div>
  );
}
