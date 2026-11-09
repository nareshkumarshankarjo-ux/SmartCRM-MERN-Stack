import { Link } from 'react-router-dom';
export default function Home() {
  const features = [
    ['Customer Management', 'Add, view, edit and delete customer records.'],
    ['Secure Authentication', 'User registration, hashed passwords and JWT login.'],
    ['CRM Dashboard', 'See customer totals and account activity.']
  ];
  return <div className="container py-5">
    <div className="text-center mb-5"><h1 className="fw-bold text-primary">Welcome to SmartCRM</h1>
    <p className="lead text-secondary">Customer Relationship Management System</p>
    <p>Manage customers with MongoDB, Express, React and Node.js.</p>
    <Link to="/dashboard" className="btn btn-primary btn-lg">Open Dashboard</Link></div>
    <div className="row g-4">{features.map(([title, text]) => <div className="col-md-4" key={title}><div className="card h-100 border-0 shadow-sm"><div className="card-body p-4"><h5 className="text-primary">{title}</h5><p className="mb-0 text-secondary">{text}</p></div></div></div>)}</div>
  </div>;
}