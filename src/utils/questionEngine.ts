import { FactStats } from '../types';

export const factKey = (a: number, b: number) => `${a}x${b}`;

export const createAllFacts = (): Record<string, FactStats> => {
  const facts: Record<string, FactStats> = {};
  for (let a = 0; a <= 12; a++) {
    for (let b = 0; b <= 12; b++) {
      const key = factKey(a, b);
      facts[key] = { key, a, b, attempts: 0, correct: 0, incorrect: 0, accuracy: 0, lastPracticed: null, mastered: false };
    }
  }
  return facts;
};

export const isMastered = (f: FactStats) => f.correct >= 5 && f.accuracy >= 85;

export const pickWeightedFact = (facts: FactStats[], fromTable?: number, fromKeys?: string[]) => {
  const pool = facts.filter((f) => (typeof fromTable === 'number' ? f.a === fromTable : true) && (fromKeys ? fromKeys.includes(f.key) : true));
  const weighted = pool.flatMap((f) => {
    const misses = Math.max(1, f.incorrect + 1);
    const masteryWeight = f.mastered ? 1 : 4;
    return Array(misses * masteryWeight).fill(f);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] ?? pool[0];
};

export const explanation = (a: number, b: number) => `${a} × ${b} means ${a} groups of ${b}. Add ${b} together ${a} times to get ${a * b}.`;
