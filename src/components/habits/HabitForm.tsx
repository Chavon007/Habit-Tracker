"use client";
import { useState } from "react";
import { saveHabits, getHabits } from "@/lib/habits";
import { validateHabitName } from "@/lib/validators";
import { Habit } from "@/types/habit";
import { getCurrentSession } from "@/lib/auth";
import { HabitFormProps } from "@/types/habit";

export function HabitForm({ onSave, onCancel, existingHabit }: HabitFormProps) {
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
    <div>
      <h2>{existingHabit ? "Edit Habit" : "New Habit"}</h2>
      <form onSubmit={handleHabitForm}>
        <label>
          Habit Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink water"
            data-testid="habit-name-input"
          />
        </label>
        <label>
          Decription
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details"
            data-testid="habit-description-input"
          />
        </label>

        <label>
          Frequency
          <select disabled value="daily" data-testid="habit-frequency-select">
            <option value="daily">Daily</option>
          </select>
        </label>

        <section>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            data-testid="habit-save-button"
          >
            {loading ? "Saving..." : "Save habit"}
          </button>
        </section>
      </form>
    </div>
  );
}
