export type GameMode = 'adventure' | 'practice' | 'speed' | 'boss' | 'review';

export interface FactStats {
  key: string;
  a: number;
  b: number;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  lastPracticed: string | null;
  mastered: boolean;
}

export interface SessionResult {
  mode: GameMode;
  total: number;
  correct: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface PlayerData {
  playerName: string;
  xp: number;
  level: number;
  coins: number;
  badges: string[];
  currentStreakDays: number;
  bestSpeedRound: number;
  totalQuestions: number;
  totalCorrect: number;
  masteredFacts: number;
  facts: Record<string, FactStats>;
  mistakeQueue: string[];
  unlockedTheme: 'classic' | 'forest' | 'space';
  reducedMotion: boolean;
  lastPlayDate: string | null;
}
