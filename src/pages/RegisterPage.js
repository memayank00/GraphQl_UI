import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    sex: '',
    dob: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerUser(form));
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start', // move form up
      alignItems: 'center',
      background: '#f5f6fa'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
          marginTop: 32, // reduce space from header
          padding: '28px 18px',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px #0001',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#1976d2', fontWeight: 700 }}>User Register</h2>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1.5px solid #bdbdbd'}
          autoComplete="username"
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Password</label>
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Enter your password"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1.5px solid #bdbdbd'}
          autoComplete="new-password"
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s'
          }}
          autoComplete="email"
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Sex</label>
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none'
          }}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <label style={{ fontWeight: 500, color: '#333', marginBottom: 2 }}>Date of Birth</label>
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1.5px solid #bdbdbd',
            fontSize: 16,
            outline: 'none'
          }}
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
          Register
        </button>
        {status === 'failed' && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
}

