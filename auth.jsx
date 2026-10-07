import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const signOut = () => { setToken(null); setUser(null); };

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    if (!getToken()) { setReady(true); return; }
    api.get('/auth/me').then((r) => setUser(r.user)).catch(signOut).finally(() => setReady(true));
  }, []);

  const authenticate = async (mode, form) => {
    const { token, user: u } = await api.post(`/auth/${mode}`, form);
    setToken(token);
    setUser(u);
  };

  return <AuthContext.Provider value={{ user, ready, authenticate, signOut }}>{children}</AuthContext.Provider>;
}
