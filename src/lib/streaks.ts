const calculateCurrentrStreak = (
  completions: string[],
  today?: string,
): number => {
  //
  const todayDate = today || new Date().toISOString().split("T")[0];

  //   remove duplicates

  const unique = [...new Set(completions)];

  //   turn streak to 0 if today's not completed

  if (!unique.includes(todayDate)) return 0;

  //   sort dates newest to oldest

  const sorted = unique.sort((a, b) => (a > b ? -1 : 1));

  //   count days backwards from today
  let streak = 0;
  let current = new Date(todayDate);

  for (const date of sorted) {
    const expected = current.toISOString().split("T")[0];

    if (date === expected) {
      streak++;

      //   move to previous days
      current.setDate(current.getDate() - 1);
    } else {
      //   break; stop counting if there is a gap
    }
  }
  return streak;
};

export default calculateCurrentrStreak;
