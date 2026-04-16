import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { authReducer, initialState } from "./authReducer";
import type { AuthState, AuthAction } from "./authReducer";
import { setAuthToken } from "../../api/axios";

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // nouveau : synchronise le token Axios à chaque changement
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook pour consommer le context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
