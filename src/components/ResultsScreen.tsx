import { SessionResult } from '../types';

export const ResultsScreen = ({ result, onClose }: { result: SessionResult; onClose: () => void }) => (
  <section className="card center"><h2>Session Complete 🎉</h2><p>Mode: {result.mode}</p><p>Correct: {result.correct}/{result.total}</p><p>XP +{result.xpEarned} • Coins +{result.coinsEarned}</p><button onClick={onClose}>Back to Modes</button></section>
);
