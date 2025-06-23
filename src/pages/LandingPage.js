import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #61dafb 0%, #282c34 100%)'
    }}>
      <h1 style={{ color: '#222', marginBottom: 32 }}>Welcome to GraphQL OTT Platform</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        <Link to="/login">
          <button style={{
            padding: '12px 32px',
            fontSize: 18,
            borderRadius: 8,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            cursor: 'pointer'
          }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{
            padding: '12px 32px',
            fontSize: 18,
            borderRadius: 8,
            border: 'none',
            background: '#43a047',
            color: '#fff',
            cursor: 'pointer'
          }}>Register</button>
        </Link>
      </div>
    </div>
  );
}
