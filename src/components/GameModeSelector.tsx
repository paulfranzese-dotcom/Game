import { GameMode } from '../types';

const modes: { id: GameMode; label: string; desc: string }[] = [
  { id: 'adventure', label: 'Adventure Mode', desc: 'Progress through tables 0-12.' },
  { id: 'practice', label: 'Practice Mode', desc: 'Choose one table to practice.' },
  { id: 'speed', label: 'Speed Round', desc: 'Answer as many as possible in 60 seconds.' },
  { id: 'boss', label: 'Boss Battle', desc: 'Mixed challenge from practiced facts.' },
  { id: 'review', label: 'Mistake Review', desc: 'Retry your tricky facts.' }
];

export const GameModeSelector = ({ onPick }: { onPick: (mode: GameMode) => void }) => (
  <section className="card">
    <h2>Choose Game Mode</h2>
    <div className="grid">
      {modes.map((m) => <button key={m.id} className="mode" onClick={() => onPick(m.id)}><strong>{m.label}</strong><span>{m.desc}</span></button>)}
    </div>
  </section>
);
