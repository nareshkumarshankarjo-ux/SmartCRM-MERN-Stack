import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
function NotFound() { return <div className="container py-5"><h2>404 - Page Not Found</h2><Link to="/">Back to Home</Link></div>; }
export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function signOut() { logout(); navigate('/login', { replace: true }); }
  return <div className="min-vh-100 bg-light d-flex flex-column">
    <nav className="navbar navbar-dark bg-primary"><div className="container d-flex flex-wrap gap-2">
      <Link to="/" className="navbar-brand fw-bold">SmartCRM</Link>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/" className="btn btn-outline-light btn-sm">Home</Link>
        {user ? <><Link to="/dashboard" className="btn btn-outline-light btn-sm">Dashboard</Link>
          <Link to="/customers" className="btn btn-light btn-sm">Customers</Link>
          <button className="btn btn-outline-light btn-sm" onClick={signOut}>Logout</button></> : <>
          <Link to="/login" className="btn btn-light btn-sm">Login</Link>
          <Link to="/register" className="btn btn-outline-light btn-sm">Register</Link></>}
      </div>
    </div></nav>
    <main className="flex-grow-1"><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes></main>
    <footer className="text-center text-secondary py-3 small">SmartCRM | MERN Stack CRM Application</footer>
  </div>;
}