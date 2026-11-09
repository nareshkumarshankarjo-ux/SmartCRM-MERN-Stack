import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!sessionStorage.getItem('smartcrm_token')) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => { if (active) setUser(data.user); })
      .catch(() => { if (active) { sessionStorage.removeItem('smartcrm_token'); setUser(null); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function authenticate(endpoint, credentials) {
    const { data } = await api.post(endpoint, credentials);
    sessionStorage.setItem('smartcrm_token', data.token);
    setUser(data.user);
    return data;
  }
  const login = credentials => authenticate('/auth/login', credentials);
  const register = credentials => authenticate('/auth/register', credentials);
  function logout() { sessionStorage.removeItem('smartcrm_token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}