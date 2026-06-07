import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "brew_co_users";
const SESSION_KEY = "brew_co_session";

const ADMIN_USER: User & { password: string } = {
  id: "admin",
  name: "Admin",
  email: "admin@brewco.com",
  password: "admin123",
  isAdmin: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const getUsers = (): Array<User & { password: string }> => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const register = (name: string, email: string, password: string) => {
    if (email.toLowerCase().trim() === ADMIN_USER.email) {
      return { success: false, error: "This email is reserved." };
    }
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      isAdmin: false,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const trimmedEmail = email.toLowerCase().trim();

    if (trimmedEmail === ADMIN_USER.email && password === ADMIN_USER.password) {
      const sessionUser: User = { id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email, isAdmin: true };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );
    if (!found) {
      return { success: false, error: "Incorrect email or password." };
    }
    const sessionUser: User = { id: found.id, name: found.name, email: found.email, isAdmin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
