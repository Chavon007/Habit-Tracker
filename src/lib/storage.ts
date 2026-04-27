import { User, Session } from "@/types/auth";
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("habit-tracker-users") || "[]");
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem("habit-tracker-users", JSON.stringify(users));
};

export const saveSession = (session: Session) => {
  localStorage.setItem("habit-tracker-session", JSON.stringify(session));
};
export const getSession = (): Session | null => {
  const data = localStorage.getItem("habit-tracker-session");
  if (!data) return null;
  return JSON.parse(data);
};

export const clearSession = () => {
  localStorage.removeItem("habit-tracker-session");
};
