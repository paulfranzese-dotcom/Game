import { useEffect, useState } from 'react';
import { NumberPad } from './NumberPad';

export function QuestionCard({ a, b, onAnswer, feedback }: { a: number; b: number; onAnswer: (n: number) => void; feedback: string }) {
  const [value, setValue] = useState('');
  useEffect(() => setValue(''), [a,b]);
  return (
    <section className="card center">
      <h2>{a} × {b} = ?</h2>
      <input value={value} inputMode="numeric" onChange={(e)=>setValue(e.target.value.replace(/[^0-9]/g,''))} onKeyDown={(e)=>e.key==='Enter' && onAnswer(Number(value))} />
      <NumberPad onInput={(v)=>setValue(v==='clear'?'':`${value}${v}`)} onSubmit={()=>onAnswer(Number(value))} />
      {feedback && <p className="feedback">{feedback}</p>}
    </section>
  );
}
