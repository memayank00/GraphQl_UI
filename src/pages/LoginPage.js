import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchMe } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, status, error } = useSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ username, password }));
  };

  React.useEffect(() => {
    if (accessToken) {
      dispatch(fetchMe(accessToken));
      navigate('/dashboard');
    }
  }, [accessToken, dispatch, navigate]);

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
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>User Login</h2>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter your username"
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
          placeholder="Enter your password"
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
          Login
        </button>
        {status === 'failed' && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
      <div style={{ flex: 1 }} />
    </div>
  );
}
