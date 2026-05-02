import { PlayerData } from '../types';
import { tableMastery } from '../utils/progress';

export function Dashboard({ player }: { player: PlayerData }) {
  const accuracy = player.totalQuestions ? Math.round((player.totalCorrect/player.totalQuestions)*100) : 0;
  return <section className="card"><h2>{player.playerName}'s Dashboard</h2><p>Level {player.level} • XP {player.xp} • Coins ⭐ {player.coins} • Streak 🔥 {player.currentStreakDays} days</p><p>Total questions: {player.totalQuestions} • Accuracy: {accuracy}% • Best speed round: {player.bestSpeedRound}</p><h3>Accuracy by table</h3><div>{Array.from({length:13},(_,t)=>{const m=tableMastery(player,t);return <div key={t}><label>Table {t}</label><progress value={m.pct} max={100}/>{Math.round(m.pct)}%</div>;})}</div><h3>Parent Summary</h3><ul><li>Needs work: &lt;60% accuracy.</li><li>Improving: 60-84% accuracy.</li><li>Mastered: 85%+ and 5+ correct per fact.</li></ul></section>;
}
