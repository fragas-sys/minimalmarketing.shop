'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const router = useRouter();

  // Carregar usuário ao montar (apenas uma vez)
  useEffect(() => {
    if (!hasInitialized) {
      initializeAuth();
    }
  }, [hasInitialized]);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      await refreshUser();
    } finally {
      setLoading(false);
      setHasInitialized(true);
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Incluir cookies
      });

      if (res.ok) {
        const data = await res.json();
        // A API retorna { user: {...} }
        if (data.user && typeof data.user === 'object' && data.user.id) {
          setUser(data.user);
          setError(null);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // A API retorna { success: true, user: {...} }
      if (data.user && typeof data.user === 'object' && data.user.id) {
        setUser(data.user);
        setError(null);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // Validações básicas
      if (!name || !email || !password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres');
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // A API retorna { success: true, user: {...} }
      if (data.user && typeof data.user === 'object' && data.user.id) {
        setUser(data.user);
        setError(null);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setError(null);
      router.push('/');
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const isAuthenticated = user !== null && typeof user === 'object' && 'id' in user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
