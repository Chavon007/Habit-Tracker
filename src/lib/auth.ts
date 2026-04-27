import { User } from "@/types/auth";
import {
  getSession,
  getUsers,
  clearSession,
  saveSession,
  saveUsers,
} from "./storage";

// sign up

export const signup = (email: string, password: string) => {
  const users = getUsers();

  //   check if user already exist

  const exists = users.find((u) => u.email === email);
  if (exists) return { success: false, error: "User already exists" };

  //   create new user

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  saveSession({ userId: newUser.id, email: newUser.email });

  return { success: true };
};

export const login = (email: string, password: string) => {
  const user = getUsers();

  //   find user
  const foundUser = user.find(
    (u) => u.email === email && u.password === password,
  );
  if (!foundUser) return { success: false, error: "Invalid email or password" };

  saveSession({ userId: foundUser.id, email: foundUser.email });

  return { success: true };
};

// logout

export const logout = (): void => {
  clearSession();
};
// get crrent session
export const getCurrentSession = () => {
  return getSession();
};

// check if logged in
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};
