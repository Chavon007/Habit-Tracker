import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { signup } from "@/lib/auth";
import { getSession } from "@/lib/storage";

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("test@example.com");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    // pre-create the user
    signup("duplicate@example.com", "password123");

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "duplicate@example.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });

  it("submits the login form and stores the active session", async () => {
    signup("login@example.com", "password123");
    localStorage.removeItem("habit-tracker-session");

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "login@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("login@example.com");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "wrong@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});
