import React from 'react';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/ott_kids.png';

export default function Header() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = !!localStorage.getItem('adminToken');
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    if (isAdmin && isAdminRoute) {
      localStorage.removeItem('adminToken');
      navigate('/login/admin');
    } else {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="app-header">
      <img
        src={logo}
        alt="Logo"
        className="app-logo"
        style={{
          boxShadow: '0 4px 16px #ffb34755, 0 0 0 4px #fff8',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fffbe6 60%, #ffe259 100%)'
        }}
      />
      <h1
        style={{
          background: 'linear-gradient(90deg, #ffb347 10%, #ffcc33 40%, #4fc3f7 80%, #1976d2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900,
          fontFamily: "'Baloo 2', 'Comic Sans MS', cursive, sans-serif",
          fontSize: '2.2rem',
          letterSpacing: '2px',
          margin: 0,
          padding: '0 8px',
          textShadow: '2px 2px 8px #fff7, 0 2px 8px #1976d2'
        }}
      >
        ChikkiStream
      </h1>
      <div className="header-right">
        {isAdmin && isAdminRoute ? (
          <>
            <span className="username">👑 admin</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : user ? (
          <>
            <span className="username">👤 {user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span className="username guest">Guest</span>
        )}
      </div>
    </header>
  );
}
