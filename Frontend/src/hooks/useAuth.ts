// Frontend/src/hooks/useAuth.ts
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Wrap your app with <AuthProvider> in the component tree.",
    );
  }
  return context;
};
