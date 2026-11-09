import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await login(form); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Check the backend server.'); }
    finally { setBusy(false); }
  }
  return <div className="container py-5 auth-width"><div className="card border-0 shadow-sm"><div className="card-body p-4">
    <h2 className="mb-4">Login to SmartCRM</h2>
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    <form onSubmit={submit}>
      <label htmlFor="loginEmail" className="form-label">Email address</label>
      <input id="loginEmail" type="email" required className="form-control mb-3" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <label htmlFor="loginPassword" className="form-label">Password</label>
      <input id="loginPassword" type="password" required className="form-control mb-3" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button disabled={busy} className="btn btn-primary w-100">{busy ? 'Logging in...' : 'Login'}</button>
    </form>
    <p className="mt-3 mb-0">New here? <Link to="/register">Create an account</Link></p>
  </div></div></div>;
}