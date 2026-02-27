import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'moji-auth-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let ignore = false;
    authApi
      .fetchMe(token)
      .then(({ user }) => { if (!ignore) setUser(user); })
      .catch(() => {
        if (ignore) return;
        setToken(null);
        try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [token]);

  const persist = (next) => {
    setToken(next);
    try {
      if (next) localStorage.setItem(TOKEN_KEY, next);
      else localStorage.removeItem(TOKEN_KEY);
    } catch { /* ignore */ }
  };

  const login = async (credentials) => {
    const { token: t, user: u } = await authApi.login(credentials);
    setUser(u);
    persist(t);
    return u;
  };

  const signup = async (payload) => {
    const { token: t, user: u } = await authApi.signup(payload);
    setUser(u);
    persist(t);
    return u;
  };

  const logout = () => {
    setUser(null);
    persist(null);
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
