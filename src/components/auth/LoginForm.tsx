"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validators";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      valid: emailValid,
      error: emailError,
      value: emailValue,
    } = validateEmail(email);
    if (!emailValid) {
      setError(emailError);
      return;
    }

    const {
      valid: passwordValid,
      error: passwordError,
      value: passwordValue,
    } = validatePassword(password);
    if (!passwordValid) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    const result = login(emailValue, passwordValue);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Login failed");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-gray-800 shadow-lg">
        <section className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </section>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Email Address
            <input
              type="email"
              name="email"
              value={email}
              placeholder="youremail@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              data-testid="auth-login-email"
              className="mt-1 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Password
            <input
              type="password"
              name="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              data-testid="auth-login-password"
              className="mt-1 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            data-testid="auth-login-submit"
            className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-500 shadow-[0_0_15px_rgba(202,138,4,0.25)] transition"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        <section className="mt-6 text-center text-sm text-gray-400">
          <p>
            No account?{" "}
            <Link href="/signup" className="text-yellow-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginForm;