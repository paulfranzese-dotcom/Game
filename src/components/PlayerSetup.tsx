import { useState } from 'react';

export function PlayerSetup({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <section className="card center">
      <h1>Multiplication Quest</h1>
      <p>Start your adventure through the multiplication worlds!</p>
      <input aria-label="Player name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter first name" />
      <button onClick={() => name.trim() && onStart(name.trim())}>Begin Quest</button>
    </section>
  );
}
