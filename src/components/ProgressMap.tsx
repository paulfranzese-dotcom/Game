import { PlayerData } from '../types';
import { tableMastery } from '../utils/progress';

export function ProgressMap({ player }: { player: PlayerData }) {
  return <section className="card"><h3>World Map (0-12)</h3><div className="map">{Array.from({length:13},(_,t)=>{const m=tableMastery(player,t);return <div key={t} className={`node ${m.tableMastered?'done':''}`}>Table {t}<small>{Math.round(m.pct)}%</small></div>;})}</div></section>;
}
