import { getCurrentSession } from "@/lib/auth";
import { SideBarProps } from "@/types/habit";
export function SideBar({ activeView, setActiveView }: SideBarProps) {
  const session = getCurrentSession();

  return (
    <div className="h-full flex flex-col justify-between p-4">
      {/* Top */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Overview</h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveView("habits")}
            type="button"
            className={`text-left px-3 py-2 rounded-lg transition ${
              activeView === "habits"
                ? "bg-yellow-600 text-white"
                : "text-gray-400 hover:bg-zinc-800"
            }`}
          >
            My Habits
          </button>

          <button
            onClick={() => setActiveView("streaks")}
            type="button"
            className={`text-left px-3 py-2 rounded-lg transition ${
              activeView === "streaks"
                ? "bg-yellow-600 text-white"
                : "text-gray-400 hover:bg-zinc-800"
            }`}
          >
            Streaks
          </button>
        </div>
      </section>

      {/* Bottom user section */}
      <section className="border-t border-gray-800 pt-3 mt-6">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="text-yellow-500 font-medium truncate">{session?.email}</p>
      </section>
    </div>
  );
}

