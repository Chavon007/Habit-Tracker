"use client";
import { toggleHabitCompletion } from "@/lib/habits";
import { getHabitSlug } from "@/lib/slug";
import calculateCurrentStreak from "@/lib/streaks";
import { HabitCardProps } from "@/types/habit";
import { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

function HabitCard({ onDelete, onEdit, onToggle, habit }: HabitCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const streak = calculateCurrentStreak(habit.completions);
  const isCompleted = habit.completions.includes(today);

  const handleToggle = () => {
    const updated = toggleHabitCompletion(habit, today);
    onToggle(updated);
  };

  const handleDelete = () => {
    onDelete(habit.id);
    setShowConfirm(false);
  };

  return (
    <>
      <div
        data-testid={`habit-card-${slug}`}
        className="w-full bg-zinc-900 border border-gray-800 rounded-2xl p-5 shadow-lg"
      >
        <div>
          {/* mobile */}
          <section className="flex md:hidden items-center justify-between mb-2">
            <h2 className="text-white font-bold text-lg">{habit.name}</h2>
            <p
              data-testid={`habit-streak-${slug}`}
              className="text-yellow-500 text-sm font-semibold"
            >
              {streak} day{streak !== 1 ? "s" : ""}
            </p>
          </section>

          <p className="text-gray-400 text-sm mb-4 flex md:hidden">
            {habit.description}
          </p>

          <section className="flex md:hidden items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(habit)}
                data-testid={`habit-edit-${slug}`}
                className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition"
              >
                <MdModeEditOutline size={18} />
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                data-testid={`habit-delete-${slug}`}
                className="p-2 rounded-lg border border-red-900 text-red-400 hover:bg-red-900/30 transition"
              >
                <MdDelete size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              data-testid={`habit-complete-${slug}`}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                isCompleted
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500"
              }`}
            >
              {isCompleted ? "✓ Done" : "Mark done"}
            </button>
          </section>

          {/* tablet & desktop */}

          <div className="hidden md:flex  md:w-full justify-between items-center">
            <section className="w-[50%] flex flex-col gap-2">
              <div className="flex  gap-1 items-center">
                <h2 className="text-white font-sans font-bold text-xl">
                  {habit.name}
                </h2>
                <p
                  data-testid={`habit-streak-${slug}`}
                  className="text-yellow-500 text-sm font-semibold font-mono"
                >
                  {streak} day{streak !== 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-gray-400 text-base mb-4 font-serif font-medium">
                {habit.description}
              </p>
            </section>

            <section className="md:w-[30%] flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => onEdit(habit)}
                  data-testid={`habit-edit-${slug}`}
                  className="p-2 rounded-lg cursor-pointer border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  data-testid={`habit-delete-${slug}`}
                  className="p-2 rounded-lg border cursor-pointer border-red-900 text-red-400 hover:bg-red-900/30 transition"
                >
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                data-testid={`habit-complete-${slug}`}
                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition ${
                  isCompleted
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500"
                }`}
              >
                {isCompleted ? "✓ Done" : "Mark done"}
              </button>
            </section>
          </div>

          {showConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
              <div className="w-full max-w-sm bg-zinc-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
                <h4 className="text-white font-bold text-lg mb-2">
                  Delete habit?
                </h4>
                <p className="text-gray-400 text-sm mb-6">
                  This will permanently delete{" "}
                  <strong className="text-white">{habit.name}</strong> and all
                  completion history. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-400 hover:border-yellow-600 hover:text-yellow-500 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    data-testid="confirm-delete-button"
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HabitCard;
