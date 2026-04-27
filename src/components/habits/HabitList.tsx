import { HabitListProps } from "@/types/habit";
import HabitCard from "./HabitCard";
import { IoIosAdd } from "react-icons/io";

export function HabitList({
  habit,
  onToggle,
  onDelete,
  onEdit,
}: HabitListProps) {
  if (habit.length === 0) {
    return (
      <div>
        <div>
          <h4>No habits yet</h4>
          <p>Start building your routine by adding your first habit</p>
          <button>
            <IoIosAdd /> Add habit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section>
        <h4>Today's habits</h4>
        <button>
          <IoIosAdd /> Add habit
        </button>
      </section>

      <div>
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
