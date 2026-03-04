import { createContext, useContext, useState, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());

  const login = useCallback(async (email, password) => {
    try {
      await authService.login(email, password);
      setUser(authService.getUser());
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = !!user && authService.isAuthenticated();

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
