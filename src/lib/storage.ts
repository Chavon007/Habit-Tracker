import { User, Session } from "@/types/auth";
import { USERS_KEY, SESSION_KEY, HABITS_KEY } from "@/lib/constants";
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveSession = (session: Session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};
export const getSession = (): Session | null => {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
