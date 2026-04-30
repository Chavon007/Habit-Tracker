export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  const todayDate = today || new Date().toISOString().split("T")[0];

  // remove duplicates
  const unique = [...new Set(completions)];

  // return 0 if today is not completed
  if (!unique.includes(todayDate)) return 0;

  // sort dates newest to oldest
  const sorted = unique.sort((a, b) => (a > b ? -1 : 1));

  // count consecutive days backwards from today
  let streak = 0;
  let current = new Date(todayDate + "T00:00:00");

  for (const date of sorted) {
    const expected = current.toISOString().split("T")[0];

    if (date === expected) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default calculateCurrentStreak;
