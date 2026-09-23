"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api, { tokenStore } from "@/lib/api";
import type { AuthResponse, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (body: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    nationality?: string;
    visaType?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /** Restores the session from the stored JWT on first mount. */
  useEffect(() => {
    const token = tokenStore.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.auth
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((auth: AuthResponse) => {
    tokenStore.set(auth.accessToken, auth.refreshToken);
    setUser(auth.user);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      persist(await api.auth.login({ username, password }));
    },
    [persist],
  );

  const register = useCallback(
    async (body: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
      nationality?: string;
      visaType?: string;
    }) => {
      persist(await api.auth.register(body));
    },
    [persist],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    setUser(await api.auth.me());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
