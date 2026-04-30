"use client";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const date = new Date().toLocaleString("en-us", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-zinc-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{date}</p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white font-serif uppercase">
          My Habits
        </h2>
      </div>

      <button
        onClick={handleLogout}
        data-testid="auth-logout-button"
        className="text-sm text-gray-400 border border-gray-700 cursor-pointer px-4 py-1.5 rounded-lg hover:border-yellow-600 hover:text-yellow-500 transition"
      >
        Logout
      </button>
    </nav>
  );
}
