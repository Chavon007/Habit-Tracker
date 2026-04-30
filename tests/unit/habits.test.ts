import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

const baseHabit: Habit = {
  id: "test-id-1",
  userId: "user-1",
  name: "Drink Water",
  description: "8 glasses a day",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2024-06-01");
    expect(result.completions).toContain("2024-06-01");
  });

  it("removes a completion date when the date already exists", () => {
    const habitWithCompletion: Habit = {
      ...baseHabit,
      completions: ["2024-06-01"],
    };
    const result = toggleHabitCompletion(habitWithCompletion, "2024-06-01");
    expect(result.completions).not.toContain("2024-06-01");
  });

  it("does not mutate the original habit object", () => {
    const original: Habit = { ...baseHabit, completions: ["2024-06-01"] };
    const originalCompletions = [...original.completions];
    toggleHabitCompletion(original, "2024-06-02");
    expect(original.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    const habitWithCompletion: Habit = {
      ...baseHabit,
      completions: ["2024-06-01"],
    };
    const result = toggleHabitCompletion(habitWithCompletion, "2024-06-01");
    // toggling existing date removes it — no duplicates possible
    expect(result.completions.filter((d) => d === "2024-06-01").length).toBe(0);

    // also verify adding doesn't create duplicates
    const result2 = toggleHabitCompletion(baseHabit, "2024-06-01");
    expect(result2.completions.filter((d) => d === "2024-06-01").length).toBe(1);
  });
});
