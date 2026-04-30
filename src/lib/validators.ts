import { error } from "console";

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim())
    return { valid: false, error: "Email is required", value: "" };
  if (!regex.test(email.trim()))
    return { valid: false, error: "Enter a valid email", value: "" };

  return { valid: true, value: email.trim(), error: null };
};

export const validatePassword = (password: string) => {
  if (!password)
    return { valid: false, error: "Password is required", value: "" };
  if (password.length < 6)
    return { valid: false, error: "must be at least 6 characters", value: "" };
  return { valid: true, value: password, error: null };
};

export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: "Habit name is required", value: "" };
  }

  if (trimmed.length > 60) {
    return {
      valid: false,
      error: "Habit name must be 60 characters or fewer",
      value: "",
    };
  }

  return { valid: true, value: trimmed, error: null };
}
