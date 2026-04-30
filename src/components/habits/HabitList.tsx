import { HabitListProps } from "@/types/habit";
import HabitCard from "./HabitCard";
import { IoIosAdd } from "react-icons/io";

export function HabitList({
  habit,
  onToggle,
  onDelete,
  onEdit,
  onAdd,
}: HabitListProps) {
  if (habit.length === 0) {
    return (
      <div data-testid="empty-state" className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-md text-center bg-zinc-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No habits yet
          </h4>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            Start building your routine by adding your first habit
          </p>
          <button
            data-testid="create-habit-button"
            onClick={onAdd}
            className="flex cursor-pointer items-center justify-center gap-2 mx-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            <IoIosAdd size={20} /> Add habit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <h4 className="text-lg sm:text-xl font-semibold text-white">
          Today&apos;s habits
        </h4>
        <button
          data-testid="create-habit-button"
          onClick={onAdd}
          className="flex cursor-pointer items-center gap-2 bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          <IoIosAdd size={20} />{" "}
          <span className="hidden sm:inline">Add habit</span>
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
        {habit.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
