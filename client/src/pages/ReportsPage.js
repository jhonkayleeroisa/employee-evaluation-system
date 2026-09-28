import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const criteria = [
  'Quality of work',
  'Communication',
  'Collaboration',
  'Initiative',
  'Professionalism',
];

function EvaluationFormPage() {
  const { token } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/evaluations/token/${token}`);
        setAssignment(res.data);
      } catch (error) {
        console.error('Error fetching evaluation:', error);
      }
    };

    fetchAssignment();
  }, [token]);

  const handleRatingChange = (criterion, value) => {
    setRatings((prev) => ({ ...prev, [criterion]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/evaluations/submit/${token}`, { ratings, comments });
    setSubmitted(true);
  };

  if (!assignment) {
    return <div style={{ padding: 40 }}>Loading evaluation form...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 18, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
        <h2>Employee Evaluation Form</h2>
        <p><strong>Evaluator:</strong> {assignment.evaluatorFirstName} {assignment.evaluatorLastName}</p>
        <p><strong>Employee:</strong> {assignment.employeeFirstName} {assignment.employeeLastName}</p>

        {submitted ? (
          <div style={{ background: '#dcfce7', color: '#166534', padding: 16, borderRadius: 10 }}>
            Evaluation submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {criteria.map((criterion) => (
              <div key={criterion} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>{criterion}</label>
                <select
                  value={ratings[criterion] || ''}
                  onChange={(e) => handleRatingChange(criterion, e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Additional Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}
              />
            </div>

            <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '12px 18px', cursor: 'pointer' }}>
              Submit Evaluation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EvaluationFormPage;
