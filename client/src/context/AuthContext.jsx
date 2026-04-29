import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();
// Wrapper component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("crm_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      // Backend call
      const response = await api.post("/auth/login", { email, password });

      const userData = response.data;

      setUser(userData);
      // This prevents logout on refresh.
      localStorage.setItem("crm_user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login Failed. Please check your credentials.";
      return { success: false, message: errorMessage };
    }
  };
  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("crm_user");
  };
  // PROVIDER
  return (
    // Share data
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
// CUSTOM HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};
