import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "admin" | "engineer" | "citizen" | "journalist";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: AuthUser;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
}

const STORAGE_KEY = "roadintel_auth";

const GUEST_USER: AuthUser = { name: "Guest User", email: "guest@roadintel.in", role: "citizen" };
const DEMO_USER: AuthUser = { name: "Admin", email: "admin@roadintel.in", role: "admin" };

function loadAuth(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, isGuest: false, user: GUEST_USER };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch { /* ignore */ }
  return { isLoggedIn: false, isGuest: false, user: GUEST_USER };
}

function saveAuth(state: AuthState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isGuest: false,
  user: GUEST_USER,
  login: () => false,
  loginAsGuest: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth);

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const login = useCallback((email: string, password: string) => {
    const e = email.trim();
    const p = password.trim();
    if (!e || !p) return false;
    if (e === "admin@roadintel.in" && p === "demo1234") {
      setAuth({ isLoggedIn: true, isGuest: false, user: DEMO_USER });
      return true;
    }
    setAuth({ isLoggedIn: true, isGuest: false, user: { name: e.split("@")[0] || "User", email: e, role: "citizen" } });
    return true;
  }, []);

  const loginAsGuest = useCallback(() => {
    setAuth({ isLoggedIn: true, isGuest: true, user: GUEST_USER });
  }, []);

  const logout = useCallback(() => {
    setAuth({ isLoggedIn: false, isGuest: false, user: GUEST_USER });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
