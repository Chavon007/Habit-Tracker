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

  const handleLogin = (e: React.FormEvent) => {
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
    const result = login(emailValue, passwordValue);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Login failed");
      return;
    }

    router.push("/dashboard");
  };
  return (
    <div>
      <section>
        <h3>Log In</h3>
      </section>
      <form onSubmit={handleLogin}>
        <div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={email}
            placeholder="youremail@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "logging..." : "Log in"}
        </button>
        {error && <p>{error}</p>}
      </form>

      <section>
        <p>No Accounts?</p> <Link href="/signup">Sign Up</Link>
      </section>
    </div>
  );
}

export default LoginForm;
