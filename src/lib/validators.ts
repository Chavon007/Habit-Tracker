export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim())
    return {
      valid: false,
      error: "Email is required",
      value: "",
    };
  if (!regex.test(email.trim()))
    return {
      valid: false,
      error: "Enter a valid email",
      value: "",
    };

  return { valid: true, value: email.trim(), error: null };
};

export const validatePassword = (password: string) => {
  if (!password)
    return { valid: false, error: "Password is required", value: "" };
  if (password.length < 6)
    return { valid: false, error: "must be at least 6 characters", value: "" };
  return { valid: true, value: password, error: null };
};
