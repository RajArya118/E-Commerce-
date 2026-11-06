import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useUI } from './UIContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useUI();

  useEffect(() => {
    const token = localStorage.getItem('nova_access_token');
    if (token) {
      authAPI.getMe()
        .then((res) => {
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('nova_user', JSON.stringify(res.data.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { access_token, user: userData } = res.data.data;
      localStorage.setItem('nova_access_token', access_token);
      localStorage.setItem('nova_user', JSON.stringify(userData));
      setUser(userData);
      showToast(`Welcome back, ${userData.full_name}`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.detail || 'Authentication failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (fullName, email, password, phone) => {
    try {
      const res = await authAPI.register({ full_name: fullName, email, password, phone });
      const { access_token, user: userData } = res.data.data;
      localStorage.setItem('nova_access_token', access_token);
      localStorage.setItem('nova_user', JSON.stringify(userData));
      setUser(userData);
      showToast('Account created successfully!', 'success');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.detail || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('nova_access_token');
    localStorage.removeItem('nova_user');
    setUser(null);
    showToast('Logged out of session', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('nova_user', JSON.stringify(updatedUser));
      showToast('Profile updated', 'success');
      return { success: true };
    } catch (err) {
      showToast('Failed to update profile', 'error');
      return { success: false };
    }
  };

  const addAddress = async (address) => {
    try {
      const res = await authAPI.addAddress(address);
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem('nova_user', JSON.stringify(updatedUser));
      showToast('Address saved', 'success');
      return { success: true };
    } catch (err) {
      showToast('Failed to save address', 'error');
      return { success: false };
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
