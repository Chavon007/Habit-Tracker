import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import { saveHabits, getHabits } from "@/lib/habits";
import { Habit } from "@/types/habit";
import { saveSession } from "@/lib/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock getCurrentSession so HabitForm can get a userId
vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    getCurrentSession: () => ({ userId: "user-test-123", email: "test@example.com" }),
  };
});

const mockHabit: Habit = {
  id: "habit-id-1",
  userId: "user-test-123",
  name: "Drink Water",
  description: "8 glasses daily",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByText("Habit name is required")).toBeInTheDocument();
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId("habit-name-input"), "Read Books");
    await user.type(screen.getByTestId("habit-description-input"), "Read for 30 mins");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = getHabits();
      expect(habits.length).toBe(1);
      expect(habits[0].name).toBe("Read Books");
      expect(habits[0].userId).toBe("user-test-123");
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    saveHabits([mockHabit]);
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} existingHabit={mockHabit} />);

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = getHabits();
      const updated = habits.find((h) => h.id === "habit-id-1");
      expect(updated).toBeDefined();
      expect(updated?.name).toBe("Drink More Water");
      expect(updated?.id).toBe(mockHabit.id);
      expect(updated?.userId).toBe(mockHabit.userId);
      expect(updated?.createdAt).toBe(mockHabit.createdAt);
      expect(updated?.completions).toEqual(mockHabit.completions);
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    saveHabits([mockHabit]);
    const user = userEvent.setup();
    const onDelete = vi.fn((id: string) => {
      const habits = getHabits().filter((h) => h.id !== id);
      saveHabits(habits);
    });

    render(
      <HabitCard
        habit={mockHabit}
        onDelete={onDelete}
        onEdit={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    // Click delete — should show confirmation, not immediately delete
    await user.click(screen.getAllByTestId("habit-delete-drink-water")[0]);
    expect(getHabits().length).toBe(1); // not deleted yet

    // Confirm deletion
    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(onDelete).toHaveBeenCalledWith("habit-id-1");
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    const today = new Date().toISOString().split("T")[0];
    const onToggle = vi.fn();

    render(
      <HabitCard
        habit={mockHabit}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
        onToggle={onToggle}
      />
    );

    const streakBefore = screen.getAllByTestId("habit-streak-drink-water")[0];
    expect(streakBefore.textContent).toContain("0");

    await user.click(screen.getAllByTestId("habit-complete-drink-water")[0]);

    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({
        completions: expect.arrayContaining([today]),
      })
    );
  });
});
