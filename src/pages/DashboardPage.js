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
    <div style={{ display: 'flex', minHeight: '80vh', background: '#f5f6fa' }}>
      <aside style={{ width: 220, background: '#222', color: '#fff', padding: '32px 0', minHeight: '100%' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <span
                style={{
                  display: 'block',
                  fontSize: 18,
                  padding: '12px 32px',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left'
                }}
              >
                🏠 Home
              </span>
            </li>
            {/* Add more user links here if needed */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40 }}>
        <h2>User Dashboard</h2>
        <div>Welcome, <b>{user?.username || 'User'}</b>!</div>
        <p>Select an option from the left menu.</p>
        <button onClick={handleLogout}>Logout</button>
      </main>
    </div>
  );
}
