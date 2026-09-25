import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('kisan_auth_token') || sessionStorage.getItem('kisan_auth_token') || null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kisan_auth_user') || sessionStorage.getItem('kisan_auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Validate session with backend on initial load if token exists
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl('/api/auth/me'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            // Update stored user details
            if (localStorage.getItem('kisan_auth_token')) {
              localStorage.setItem('kisan_auth_user', JSON.stringify(data.user));
            } else {
              sessionStorage.setItem('kisan_auth_user', JSON.stringify(data.user));
            }
          }
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.warn("Could not verify session with backend:", err);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        remember_me: rememberMe
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.detail || 'Login failed. Please check your credentials.');
    }

    const authToken = data.token;
    const authUser = data.user;

    setToken(authToken);
    setUser(authUser);

    if (rememberMe) {
      localStorage.setItem('kisan_auth_token', authToken);
      localStorage.setItem('kisan_auth_user', JSON.stringify(authUser));
      sessionStorage.removeItem('kisan_auth_token');
      sessionStorage.removeItem('kisan_auth_user');
    } else {
      sessionStorage.setItem('kisan_auth_token', authToken);
      sessionStorage.setItem('kisan_auth_user', JSON.stringify(authUser));
      localStorage.removeItem('kisan_auth_token');
      localStorage.removeItem('kisan_auth_user');
    }

    return authUser;
  };

  const register = async (userData) => {
    const res = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.detail || 'Registration failed. Please check form entries.');
    }

    return data;
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        console.warn("Logout request failed:", e);
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('kisan_auth_token');
    localStorage.removeItem('kisan_auth_user');
    sessionStorage.removeItem('kisan_auth_token');
    sessionStorage.removeItem('kisan_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
