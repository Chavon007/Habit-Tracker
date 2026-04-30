export type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
};

export type HabitFormProps = {
  onSave: () => void;
  onCancel: () => void;
  existingHabit?: Habit;
};

export type HabitCardProps = {
  onDelete: (id: string) => void;
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onToggle: (habit: Habit) => void;
};

export type HabitListProps = {
  onDelete: (id: string) => void;
  habit: Habit[];
  onEdit: (habit: Habit) => void;
  onToggle: (habit: Habit) => void;
  onAdd: () => void;
};

export type SideBarProps = {
  activeView: "habits" | "streaks";
  setActiveView: (v: "habits" | "streaks") => void;
};
