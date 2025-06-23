import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LandingPage from './pages/LandingPage';
import { useSelector, useDispatch } from 'react-redux';
import Header from './components/Header';
import { fetchMe, setTokens } from './features/authSlice';

function PrivateRoute({ children }) {
  const accessToken = useSelector(state => state.auth.accessToken);
  return accessToken ? children : <Navigate to="/login" />;
}

export default function App() {
  const accessToken = useSelector(state => state.auth.accessToken);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // On mount, if tokens exist in localStorage but not in Redux, sync them
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken && !accessToken) {
      dispatch(setTokens({ accessToken: storedAccessToken, refreshToken: storedRefreshToken }));
    }
  }, [accessToken, dispatch]);

  React.useEffect(() => {
    if (accessToken) {
      dispatch(fetchMe(accessToken));
    }
  }, [accessToken, dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
