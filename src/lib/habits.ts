import { Habit } from "@/types/habit";
import { HABITS_KEY } from "@/lib/constants";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  if (habit.completions.includes(date)) {
    return {
      ...habit,
      completions: habit.completions.filter((d) => d !== date),
    };
  }

  // add date and ensure no duplicates
  return {
    ...habit,
    completions: [...new Set([...habit.completions, date])],
  };
}

export const getHabits = (): Habit[] => {
  return JSON.parse(localStorage.getItem(HABITS_KEY) || "[]");
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};
