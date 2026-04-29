"use client";
import { useState } from "react";
import { saveHabits, getHabits } from "@/lib/habits";
import { validateHabitName } from "@/lib/validators";
import { Habit } from "@/types/habit";
import { getCurrentSession } from "@/lib/auth";
import { HabitFormProps } from "@/types/habit";

function HabitForm({ onSave, onCancel, existingHabit }: HabitFormProps) {
  const session = getCurrentSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleHabitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const {
      valid: validHabitName,
      error: errorHabitName,
      value: valueHabitName,
    } = validateHabitName(name);

    if (!validHabitName) {
      setError(errorHabitName);
      return;
    }
    if (!session) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: valueHabitName,
      description: description.trim(),
      frequency: "daily",
      createdAt: existingHabit?.createdAt || new Date().toISOString(),
      completions: existingHabit?.completions || [],
    };

    const existing = getHabits();
    if (existingHabit) {
      saveHabits(
        existing.map((h) => (h.id === existingHabit.id ? newHabit : h)),
      );
    } else {
      saveHabits([...existing, newHabit]);
    }
    setLoading(false);
    onSave();
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">
          {existingHabit ? "Edit Habit" : "New Habit"}
        </h2>

        <form onSubmit={handleHabitForm} className="space-y-4">
          <label className="block text-sm text-gray-300">
            Habit Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water"
              data-testid="habit-name-input"
              className="mt-1 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
              data-testid="habit-description-input"
              className="mt-1 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </label>

          <label className="block text-sm text-gray-300">
            Frequency
            <select
              disabled
              value="daily"
              data-testid="habit-frequency-select"
              className="mt-1 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-gray-400"
            >
              <option value="daily">Daily</option>
            </select>
          </label>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <section className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              data-testid="habit-save-button"
              className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-500 shadow-[0_0_15px_rgba(202,138,4,0.25)] transition"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Saving..." : "Save habit"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
export default HabitForm;
