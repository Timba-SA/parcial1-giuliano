import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'empleado' | 'cliente' | 'anonimo';

interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
  is_active: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole;
  token: string | null;
  isLoggedIn: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: 'anonimo',
  token: null,
  isLoggedIn: false,
  logout: () => {},
  refreshUser: () => {},
});

function getRoleFromRoles(roles: string[]): UserRole {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('empleado')) return 'empleado';
  if (roles.includes('cliente')) return 'cliente';
  return 'cliente'; // default cuando está logueado pero sin rol asignado
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const fetchUser = async (tok: string) => {
    try {
      const payload = JSON.parse(atob(tok.split('.')[1]));
      const email: string = payload.sub;
      const res = await fetch('http://localhost:8000/usuarios/', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const users: AuthUser[] = await res.json();
      const found = users.find((u) => u.email === email) ?? null;
      setUser(found);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (token) fetchUser(token);
    else setUser(null);
  }, [token]);

  // Escuchar cambios en localStorage (login desde otra pestaña / LoginPage)
  useEffect(() => {
    const onStorage = () => {
      const t = localStorage.getItem('token');
      setToken(t);
    };
    window.addEventListener('storage', onStorage);
    // También polling cada 2s para capturar el login en la misma pestaña
    const interval = setInterval(() => {
      const t = localStorage.getItem('token');
      setToken((prev) => (prev !== t ? t : prev));
    }, 2000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => {
    const t = localStorage.getItem('token');
    if (t) fetchUser(t);
  };

  const role: UserRole = user ? getRoleFromRoles(user.roles.map((r) => (typeof r === 'string' ? r : (r as { codigo: string }).codigo))) : 'anonimo';

  return (
    <AuthContext.Provider value={{ user, role, token, isLoggedIn: !!user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
