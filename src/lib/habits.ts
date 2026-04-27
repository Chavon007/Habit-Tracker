import { Habit } from "@/types/habit";
const toggleHabitCompletion = (habit: Habit, date: string): Habit => {
  //   unmark if date alreadyb exists
  if (habit.completions.includes(date)) {
    return {
      ...habit,
      completions: habit.completions.filter((d) => d !== date),
    };
  }

  //   mark as complete if date does not exist
  return {
    ...habit,
    completions: [...habit.completions, date],
  };
};

export default toggleHabitCompletion;
