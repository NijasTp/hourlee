import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('hourlee_token');
    if (token) {
      try {
        const data = await authAPI.getMe();
        setUser(data.user);
      } catch (err) {
        console.error('[Auth Error] Token invalid or expired', err);
        localStorage.removeItem('hourlee_token');
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (loginId, password) => {
    const data = await authAPI.login(loginId, password);
    localStorage.setItem('hourlee_token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await authAPI.signup(username, email, password);
    localStorage.setItem('hourlee_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hourlee_token');
    setUser(null);
  };

  const addSuggestion = async (text) => {
    const res = await authAPI.addSuggestion(text);
    setUser((prev) => (prev ? { ...prev, suggestions: res.suggestions } : null));
    return res;
  };

  const removeSuggestion = async (text) => {
    const res = await authAPI.removeSuggestion(text);
    setUser((prev) => (prev ? { ...prev, suggestions: res.suggestions } : null));
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, addSuggestion, removeSuggestion, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
