import { FactStats, PlayerData } from '../types';
import { isMastered } from './questionEngine';
import { levelFromXp, xpForAnswer } from './scoring';

export const updateFact = (fact: FactStats, correct: boolean): FactStats => {
  const attempts = fact.attempts + 1;
  const correctCount = fact.correct + (correct ? 1 : 0);
  const incorrect = fact.incorrect + (correct ? 0 : 1);
  const accuracy = Math.round((correctCount / attempts) * 100);
  const next = { ...fact, attempts, correct: correctCount, incorrect, accuracy, lastPracticed: new Date().toISOString() };
  return { ...next, mastered: isMastered(next) };
};

export const applyAnswer = (player: PlayerData, key: string, correct: boolean, streak: number): PlayerData => {
  const fact = player.facts[key];
  const nextFact = updateFact(fact, correct);
  const xpGain = xpForAnswer(correct, streak);
  const coinsGain = correct ? 1 : 0;
  const mistakeQueue = correct ? player.mistakeQueue.filter((k) => k !== key) : Array.from(new Set([...player.mistakeQueue, key]));
  const totalQuestions = player.totalQuestions + 1;
  const totalCorrect = player.totalCorrect + (correct ? 1 : 0);
  const masteredFacts = Object.values({ ...player.facts, [key]: nextFact }).filter((f) => f.mastered).length;

  return {
    ...player,
    xp: player.xp + xpGain,
    coins: player.coins + coinsGain,
    level: levelFromXp(player.xp + xpGain),
    totalQuestions,
    totalCorrect,
    masteredFacts,
    facts: { ...player.facts, [key]: nextFact },
    mistakeQueue
  };
};

export const tableMastery = (player: PlayerData, table: number) => {
  const tableFacts = Object.values(player.facts).filter((f) => f.a === table);
  const mastered = tableFacts.filter((f) => f.mastered).length;
  const pct = (mastered / tableFacts.length) * 100;
  return { mastered, total: tableFacts.length, pct, tableMastered: pct >= 90 };
};
