import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('admin@evaluation-system.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#edf2ff' }}>
      <div style={{ width: 420, background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 8 }}>Employee Evaluation System</h2>
        <p style={{ marginTop: 0, color: '#64748b' }}>Sign in as administrator</p>

        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 10, borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={inputStyle} required />
          </div>

          <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '12px 18px', cursor: 'pointer' }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: 18, color: '#64748b', fontSize: 14 }}>
          Demo admin: <strong>admin@evaluation-system.com</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  marginTop: 6,
};

export default LoginPage;
