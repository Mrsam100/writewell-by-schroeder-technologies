/** @license SPDX-License-Identifier: Apache-2.0 */
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/** Read the CSRF token from the cookie */
function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)writewell_csrf=([^;]+)/);
  return match ? match[1] : "";
}

/** Safely parse JSON from a response. Returns parsed data or throws with a readable error. */
async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      res.ok ? "Unexpected server response." : `Server error (${res.status}). Please try again.`
    );
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track whether user was set via login/register so we skip the /me call
  const skipMeRef = useRef(false);

  // On mount, validate existing session with /me
  useEffect(() => {
    if (skipMeRef.current) {
      skipMeRef.current = false;
      setIsLoading(false);
      return;
    }

    // Check if guest mode was active
    const isGuest = sessionStorage.getItem("writewell_guest");
    if (isGuest) {
      setUser({ id: 0, email: "guest@writewell.test", name: "Test User" });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return safeJson(r);
      })
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.error || "Login failed");
    skipMeRef.current = true;
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });
    const data = await safeJson(res);
    if (!res.ok) throw new Error(data.error || "Registration failed");
    skipMeRef.current = true;
    setUser(data.user);
  };

  const loginAsGuest = () => {
    skipMeRef.current = true;
    setUser({ id: 0, email: "guest@writewell.test", name: "Test User" });
    sessionStorage.setItem("writewell_guest", "true");
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "X-CSRF-Token": getCsrfToken() },
        credentials: "include",
      });
    } catch {
      // Server logout failed -- still clear local state
    }
    setUser(null);
    sessionStorage.removeItem("writewell_guest");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsGuest, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
