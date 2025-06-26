import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate authentication check
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock login functionality
      const mockUser = { 
        id: 1, 
        email, 
        name: 'John Doe',
        role: 'guest'
      };
      setUser(mockUser);
      setError(null);
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setError(null);
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      // Mock signup functionality
      const mockUser = { 
        id: Date.now(), 
        ...userData,
        role: 'guest'
      };
      setUser(mockUser);
      setError(null);
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (user) {
      setUser({ ...user, ...profileData });
    }
  };

  const getProfile = async () => {
    return user;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    updateProfile,
    getProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};