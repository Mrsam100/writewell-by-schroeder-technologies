/** @license SPDX-License-Identifier: Apache-2.0 */
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("writewell_token"));
  const [isLoading, setIsLoading] = useState(true);

  // Track whether user was set via login/register so we skip the /me call
  const skipMeRef = useRef(false);

  // On mount (or token change), validate existing token with /me
  // but skip if user was already set from login/register response
  useEffect(() => {
    if (skipMeRef.current) {
      skipMeRef.current = false;
      setIsLoading(false);
      return;
    }
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (!cancelled) setUser(data.user); })
      .catch(() => {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          localStorage.removeItem("writewell_token");
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    skipMeRef.current = true;
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("writewell_token", data.token);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    skipMeRef.current = true;
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("writewell_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("writewell_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
