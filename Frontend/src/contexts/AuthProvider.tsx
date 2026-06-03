import React, { useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { logoutApi, getCurrentUserApi } from "../api/authApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUserApi();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      setUser,
      logout,
    }),
    [user, isLoading, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};