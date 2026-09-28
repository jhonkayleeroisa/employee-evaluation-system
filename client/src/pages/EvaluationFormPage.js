import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TemplatesPage() {
  const [employees, setEmployees] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [cycleForm, setCycleForm] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [assignment, setAssignment] = useState({ evaluationCycleId: '', evaluatorId: '', employeeId: '' });

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
        console.error('Fetch error', error);
      }
    };

    fetchData();
  }, []);

  const handleCycleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post('/evaluations/cycles', cycleForm);
    setCycles((prev) => [res.data, ...prev]);
    setCycleForm({ name: '', description: '', startDate: '', endDate: '' });
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    await api.post('/evaluations/assign', assignment);
    alert('Evaluation assigned and notification email queued.');
    setAssignment({ evaluationCycleId: '', evaluatorId: '', employeeId: '' });
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create Evaluation Cycle</h2>

      <form onSubmit={handleCycleSubmit} style={{ background: 'white', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <Field label="Cycle Name"><input value={cycleForm.name} onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })} /></Field>
          <Field label="Start Date"><input type="date" value={cycleForm.startDate} onChange={(e) => setCycleForm({ ...cycleForm, startDate: e.target.value })} /></Field>
          <Field label="End Date"><input type="date" value={cycleForm.endDate} onChange={(e) => setCycleForm({ ...cycleForm, endDate: e.target.value })} /></Field>
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Description"><textarea value={cycleForm.description} onChange={(e) => setCycleForm({ ...cycleForm, description: e.target.value })} rows={4} style={{ width: '100%' }} /></Field>
        </div>
        <button type="submit" style={primaryButton}>Create Cycle</button>
      </form>

      <h3>Assign Evaluator to Employee</h3>
      <form onSubmit={handleAssignmentSubmit} style={{ background: 'white', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Field label="Evaluation Cycle">
            <select value={assignment.evaluationCycleId} onChange={(e) => setAssignment({ ...assignment, evaluationCycleId: e.target.value })}>
              <option value="">Select cycle</option>
              {cycles.map((cycle) => <option key={cycle.id} value={cycle.id}>{cycle.name}</option>)}
            </select>
          </Field>

          <Field label="Evaluator">
            <select value={assignment.evaluatorId} onChange={(e) => setAssignment({ ...assignment, evaluatorId: e.target.value })}>
              <option value="">Select evaluator</option>
              {evaluators.map((evaluator) => <option key={evaluator.id} value={evaluator.id}>{evaluator.firstName} {evaluator.lastName}</option>)}
            </select>
          </Field>

          <Field label="Employee">
            <select value={assignment.employeeId} onChange={(e) => setAssignment({ ...assignment, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>)}
            </select>
          </Field>
        </div>

        <button type="submit" style={primaryButton}>Assign & Send Email</button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', fontWeight: 600, color: '#334155' }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

const primaryButton = {
  marginTop: 16,
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  padding: '10px 16px',
  cursor: 'pointer',
};

export default TemplatesPage;
