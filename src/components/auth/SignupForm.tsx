import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validators";
import Link from "next/link";
function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      valid: emailValid,
      error: emailError,
      value: emailValue,
    } = validateEmail(email);
    if (!validateEmail) {
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
    const data = signup(emailValue, passwordValue);
    setLoading(false);
    if (!data.success) {
      setError(data.error ?? "Sign up failed");
      return;
    }

    router.push("/login");
  };

  return (
    <div>
      <section>
        <h3>Create account</h3>
      </section>
      <form onSubmit={handleSignup}>
        <div>
          <h2>Get started</h2>
          <p>Sign up to track your habits</p>
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
          {loading ? "creating..." : "Create account"}
        </button>
        {error && <p>{error}</p>}
      </form>

      <section>
        <p>Already have an account?</p> <Link href="/signup">Log in</Link>
      </section>
    </div>
  );
}
