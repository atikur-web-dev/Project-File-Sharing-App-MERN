// Global memory state for user to check if he is logged in or not
import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const defaultAuthContextValue: AuthContextType = {
  user: null,
  isLoading: true, // Initially true = "checking authentication"
  isAuthenticated: false,
  setUser: () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(
  defaultAuthContextValue,
);
