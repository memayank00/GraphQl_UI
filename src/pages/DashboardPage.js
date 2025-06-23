import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Welcome, {user?.username || 'User'}!</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
