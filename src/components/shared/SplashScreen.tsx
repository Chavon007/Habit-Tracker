"use client";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex items-center justify-center bg-black text-white"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-wide">Habit Tracker</h1>

        <p className="text-gray-400 mt-2">Loading your habits...</p>

        <div className="mt-6 w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
