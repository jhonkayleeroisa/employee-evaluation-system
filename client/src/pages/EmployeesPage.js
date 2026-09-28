import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, evaluatorsRes, cyclesRes] = await Promise.all([
          api.get('/employees'),
          api.get('/evaluators'),
          api.get('/evaluations/cycles'),
        ]);

        setEmployees(employeesRes.data);
        setEvaluators(evaluatorsRes.data);
        setCycles(cyclesRes.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <Header />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 24 }}>
        <StatCard title="Employees" value={employees.length} link="/employees" />
        <StatCard title="Evaluators" value={evaluators.length} link="/evaluators" />
        <StatCard title="Evaluation Cycles" value={cycles.length} link="/templates" />
      </div>

      <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div style={panelStyle}>
          <h3>Recent evaluation cycles</h3>
          {cycles.length ? cycles.map((cycle) => (
            <div key={cycle.id} style={{ padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <strong>{cycle.name}</strong>
              <div style={{ color: '#64748b', fontSize: 14 }}>
                {cycle.startDate} → {cycle.endDate}
              </div>
            </div>
          )) : <p>No cycles yet.</p>}
        </div>

        <div style={panelStyle}>
          <h3>Quick actions</h3>
          <Link to="/employees" style={actionLink}>Manage employees</Link>
          <Link to="/evaluators" style={actionLink}>Manage evaluators</Link>
          <Link to="/templates" style={actionLink}>Create evaluation cycle</Link>
          <Link to="/reports" style={actionLink}>View reports</Link>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={navLink}>Overview</Link>
        <Link to="/employees" style={navLink}>Employees</Link>
        <Link to="/evaluators" style={navLink}>Evaluators</Link>
        <Link to="/reports" style={navLink}>Reports</Link>
        <button onClick={handleLogout} style={logoutButton}>Logout</button>
      </div>
    </div>
  );
}

function StatCard({ title, value, link }) {
  return (
    <Link to={link} style={{ ...cardStyle, display: 'block' }}>
      <div style={{ color: '#64748b' }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: '700', marginTop: 8 }}>{value}</div>
    </Link>
  );
}

const panelStyle = {
  background: 'white',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
};

const cardStyle = {
  background: 'white',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  color: '#0f172a',
};

const navLink = {
  color: '#1e293b',
  textDecoration: 'none',
  fontWeight: 600,
  padding: '8px 10px',
  borderRadius: 8,
};

const actionLink = {
  display: 'block',
  background: '#eff6ff',
  color: '#1d4ed8',
  padding: '12px 14px',
  borderRadius: 10,
  marginBottom: 12,
  fontWeight: 600,
};

const logoutButton = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '10px 16px',
  cursor: 'pointer',
};

export default DashboardPage;
