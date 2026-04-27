"use client";
import { useState, useEffect } from "react";
import { HabitList } from "@/components/habits/HabitList";
import { Navbar } from "@/components/navbar/navbar";
import HabitForm from "@/components/habits/HabitForm";
import { getHabits, saveHabits } from "@/lib/habits";
import { getCurrentSession } from "@/lib/auth";
import { Habit } from "@/types/habit";

function DashBoard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined,
  );

  const session = getCurrentSession();

  // load habits on mount — filter by current user
  useEffect(() => {
    const all = getHabits();
    const userHabits = all.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
  }, []);

  // refresh habits from localStorage
  const refreshHabits = () => {
    const all = getHabits();
    const userHabits = all.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
  };

  const handleDelete = (id: string) => {
    const all = getHabits();
    saveHabits(all.filter((h) => h.id !== id));
    refreshHabits();
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleToggle = (updated: Habit) => {
    const all = getHabits();
    saveHabits(all.map((h) => (h.id === updated.id ? updated : h)));
    refreshHabits();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingHabit(undefined);
    refreshHabits();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(undefined);
  };

  return (
    <>
      <Navbar />
      <main
        data-testid="dashboard-page"
        className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-8 py-6 w-full h-screen"
      >
        <HabitList
          habit={habits}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onAdd={() => setShowForm(true)}
        />

        {showForm && (
          <HabitForm
            onSave={handleSave}
            onCancel={handleCancel}
            existingHabit={editingHabit}
          />
        )}
      </main>
    </>
  );
}

export default DashBoard;
