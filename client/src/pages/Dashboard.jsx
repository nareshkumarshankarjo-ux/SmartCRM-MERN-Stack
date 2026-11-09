import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function Dashboard() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api.get('/customers').then(({ data }) => { if (active) setCustomers(data.customers); })
      .catch(err => { if (active) setError(err.response?.data?.message || 'Could not load customers'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const newSince = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const stats = [
    ['Total Customers', customers.length],
    ['Active Customers', customers.filter(c => c.status === 'active').length],
    ['New Customers (30 days)', customers.filter(c => new Date(c.createdAt).getTime() >= newSince).length]
  ];
  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div><h2>SmartCRM Dashboard</h2><p className="text-secondary mb-0">Welcome, {user?.name}</p></div><Link className="btn btn-primary" to="/customers">Manage Customers</Link></div>
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    {loading ? <p>Loading dashboard...</p> : <div className="row g-3">{stats.map(([title, count]) => <div className="col-md-4" key={title}><div className="card shadow-sm border-0"><div className="card-body"><h6>{title}</h6><h2 className="text-primary">{count}</h2></div></div></div>)}</div>}
  </div>;
}