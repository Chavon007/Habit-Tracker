import { Habit } from "@/types/habit";
import { HABITS_KEY } from "@/lib/constants";
export  const toggleHabitCompletion = (habit: Habit, date: string): Habit => {
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

export const getHabits = (): Habit[] => {
  return JSON.parse(localStorage.getItem(HABITS_KEY) || "[]");
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};


