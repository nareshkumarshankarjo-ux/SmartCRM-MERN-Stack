import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await register(form); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed. Check the backend server.'); }
    finally { setBusy(false); }
  }
  return <div className="container py-5 auth-width"><div className="card border-0 shadow-sm"><div className="card-body p-4">
    <h2 className="mb-4">Create your account</h2>
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    <form onSubmit={submit}>
      <label htmlFor="regName" className="form-label">Full name</label>
      <input id="regName" className="form-control mb-3" minLength={2} maxLength={100} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <label htmlFor="regEmail" className="form-label">Email address</label>
      <input id="regEmail" className="form-control mb-3" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <label htmlFor="regPassword" className="form-label">Password (at least 8 characters)</label>
      <input id="regPassword" className="form-control mb-3" type="password" minLength={8} maxLength={128} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button disabled={busy} className="btn btn-primary w-100">{busy ? 'Creating...' : 'Register'}</button>
    </form>
    <p className="mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p>
  </div></div></div>;
}