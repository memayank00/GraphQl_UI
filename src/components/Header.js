import React from 'react';
import './Header.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

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
        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        alt="Logo"
        className="app-logo"
      />
      <h1>GraphQL Demo UI</h1>
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
