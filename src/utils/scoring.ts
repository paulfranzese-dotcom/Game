export const levelFromXp = (xp: number) => Math.floor(xp / 120) + 1;

export const xpForAnswer = (correct: boolean, streak: number) => {
  if (!correct) return 0;
  const streakBonus = streak > 0 && streak % 5 === 0 ? 5 : 0;
  return 10 + streakBonus;
};
