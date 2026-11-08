import { createContext, useContext, useEffect, useState } from "react";
import api from '../services/api.js'
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login session when app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    setUser(data.user);

    return data.user;
  };

  // Register
  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);

    setUser(data.user);

    return data.user;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication
export const useAuth = () => {
  return useContext(AuthContext);
};
