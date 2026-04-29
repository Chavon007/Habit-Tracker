"use client";
import { useState, useEffect } from "react";
import { HabitList } from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import { getHabits, saveHabits } from "@/lib/habits";
import { getCurrentSession } from "@/lib/auth";
import { Habit } from "@/types/habit";
import { Navbar } from "@/components/navbar/Navbar";
import { SideBar } from "@/components/navbar/Sidebar";
import calculateCurrentrStreak from "@/lib/streaks";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
function DashBoard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined,
  );
  const [activeView, setActiveView] = useState<"habits" | "streaks">("habits");

  const session = getCurrentSession();

  // load habits
  useEffect(() => {
    const all = getHabits();
    const userHabits = all.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
  }, []);

  // refresh habits
  const refreshHabits = () => {
    const all = getHabits();
    const userHabits = all.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
  };

  //  calculate streak habit
  const totalHabits = habits.length;

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
  // completed task

  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  const bestStreak = Math.max(
    ...habits.map((h) => calculateCurrentrStreak(h.completions)),
  );
  return (
    <>
      <ProtectedRoute>
        <Navbar />

        <main
          data-testid="dashboard-page"
          className="min-h-screen bg-black text-white"
        >
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block w-64 border-r border-gray-800 bg-zinc-950">
              <SideBar activeView={activeView} setActiveView={setActiveView} />
            </div>

            {/* Main */}
            <div className="flex-1 px-4 sm:px-6 md:px-10 py-6">
              {/*Total habits UI FIXED */}
              <div className="hidden  mb-4 md:flex md:justify-between items-center gap-2">
                <div className="bg-zinc-900 border border-gray-800 p-3 rounded-xl w-50 h-25 flex flex-col justify-center items-center">
                  <h4 className="text-gray-400 text-sm">Total Habits</h4>
                  <p className="text-yellow-500 font-bold text-lg">
                    {totalHabits}
                  </p>
                </div>
                <div className="bg-zinc-900 border border-gray-800 p-3 rounded-xl w-50 h-25 flex flex-col justify-center items-center">
                  <p className="text-gray-400 text-sm">Completed Today</p>
                  <p className="text-green-500 font-bold">{completedToday}</p>
                </div>

                <div className="bg-zinc-900 border border-gray-800 p-3 rounded-xl w-50 h-25 flex flex-col justify-center items-center">
                  <p className="text-gray-400 text-xs">Best Streak</p>
                  <p className="text-yellow-500 font-bold">{bestStreak}</p>
                </div>
              </div>

              {activeView === "habits" && (
                <HabitList
                  habit={habits}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                  onAdd={() => setShowForm(true)}
                />
              )}

              {activeView === "streaks" && (
                <div className="text-white font-sans italic flex justify-center items-center text-3xl text-center mt-10">
                  Working on it
                </div>
              )}
            </div>
          </div>

          {showForm && (
            <HabitForm
              onSave={handleSave}
              onCancel={handleCancel}
              existingHabit={editingHabit}
            />
          )}
        </main>
      </ProtectedRoute>
    </>
  );
}

export default DashBoard;
